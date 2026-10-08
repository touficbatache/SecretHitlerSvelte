import { type Browser, expect, type Page, test } from "@playwright/test"

import {
  ALICE,
  apiCalls,
  BOB,
  db,
  enterGame,
  expectBannerText,
  failApi,
  gameInProgress,
  isConnected,
  reconnectBanner,
  recordValues,
  resetApi,
  setGamesForSelf,
  signIn,
  sleep,
  type TestUser,
  until,
} from "./helpers"

test.describe.configure({ mode: "serial" })

let alice: Page
let bob: Page

async function playerPage(browser: Browser, user: TestUser): Promise<Page> {
  const page: Page = await (await browser.newContext()).newPage()
  await signIn(page, user)
  return page
}

test.beforeAll(async ({ browser }) => {
  alice = await playerPage(browser, ALICE)
  bob = await playerPage(browser, BOB)
})

test.beforeEach(async () => {
  await resetApi()
})

test("presence stays connected from the waiting room, through the intro, to the gameplay", async () => {
  const code: string = "700001"
  await db(
    "PUT",
    `ongoingGames/${code}`,
    gameInProgress({ status: "waiting", subStatus: null, currentSession: null, startedAt: null }),
  )
  await enterGame(alice, code, "/waitingRoom")
  await until(async () => (await isConnected(code, ALICE.uid)) === true, "alice connected")

  const recording: { values: unknown[]; stop: () => void } = recordValues(
    `ongoingGames/${code}/connected/${ALICE.uid}`,
  )
  await db("PATCH", `ongoingGames/${code}`, { status: "settingUp", startedAt: Date.now() })
  await alice.waitForURL("**/intro")
  await sleep(1500)
  expect(await isConnected(code, ALICE.uid)).toBe(true)

  await db("PATCH", `ongoingGames/${code}`, {
    status: "election",
    subStatus: "election_presidentChoosingChancellor",
    currentSession: { presidentId: "carol" },
  })
  await alice.waitForURL("**/gameplay")
  await sleep(2000)
  recording.stop()

  expect(recording.values).not.toContain(false)
  expect(await isConnected(code, ALICE.uid)).toBe(true)
})

test("an offline President shows 'Waiting for carol to reconnect…' after 5 seconds", async () => {
  const code: string = "700002"
  await db("PUT", `ongoingGames/${code}`, gameInProgress())
  await Promise.all([enterGame(alice, code, "/gameplay"), enterGame(bob, code, "/gameplay")])
  await until(
    async () =>
      (await isConnected(code, ALICE.uid)) === true && (await isConnected(code, BOB.uid)) === true,
    "both players connected",
  )
  // Both pages show the game, so the 5 seconds below start from a page that is up and running
  await alice.getByText("The President is choosing their Chancellor").waitFor()
  await bob.getByText("The President is choosing their Chancellor").waitFor()
  await sleep(1000)

  await db("PUT", `ongoingGames/${code}/connected/carol`, false)
  await sleep(3000)
  await expect(reconnectBanner(alice)).toHaveCount(0)
  await expectBannerText(alice, "Waiting for carol to reconnect…")
  await expectBannerText(bob, "Waiting for carol to reconnect…")

  await db("PUT", `ongoingGames/${code}/connected/carol`, true)
  await expect(reconnectBanner(alice)).toHaveCount(0, { timeout: 3000 })
  await expect(reconnectBanner(bob)).toHaveCount(0, { timeout: 3000 })
})

test("a drop shorter than 5 seconds shows nothing", async () => {
  const code: string = "700002"
  await db("PUT", `ongoingGames/${code}/connected/carol`, false)
  await sleep(2000)
  await db("PUT", `ongoingGames/${code}/connected/carol`, true)
  await sleep(5000)
  await expect(reconnectBanner(bob)).toHaveCount(0)
})

test("a vote only waits for the offline players who haven't voted", async () => {
  const code: string = "700002"
  await db("PATCH", `ongoingGames/${code}`, {
    subStatus: "election_voting",
    currentSession: { presidentId: "carol", chancellorId: "dave", votes: { carol: true } },
    connected: { [ALICE.uid]: true, [BOB.uid]: true, carol: false, dave: false, eve: true },
  })
  await expectBannerText(bob, "Waiting for dave to reconnect…")
})

test("'Leave for now' makes the others wait, and rejoining ends the wait", async () => {
  const code: string = "700002"
  await db("PATCH", `ongoingGames/${code}`, {
    subStatus: "election_presidentChoosingChancellor",
    currentSession: { presidentId: ALICE.uid },
  })
  await db("PATCH", `ongoingGames/${code}/connected`, { carol: true, dave: true })
  await alice.getByText("Choose your Chancellor").waitFor()

  await alice.locator('button[title="Leave for now"]').first().click()
  await alice.getByText("The game will wait for you. Rejoin from Game history.").waitFor()
  await alice.locator("button", { hasText: "Leave for now" }).click()
  await until(async () => (await isConnected(code, ALICE.uid)) === false, "alice offline")
  await expectBannerText(bob, "Waiting for alice to reconnect…")

  await enterGame(alice, code, "/gameplay")
  await until(async () => (await isConnected(code, ALICE.uid)) === true, "alice back")
  await expect(reconnectBanner(bob)).toHaveCount(0, { timeout: 3000 })
})

test("minimizing lasts one phase, shows whose turn it is, and never hides the end screen", async () => {
  const code: string = "700003"
  await db(
    "PUT",
    `ongoingGames/${code}`,
    gameInProgress({ currentSession: { presidentId: ALICE.uid } }),
  )
  await enterGame(alice, code, "/gameplay")
  await alice.getByText("Choose your Chancellor").waitFor()
  await alice.getByRole("button", { name: "Minimize" }).click()
  await alice.getByRole("button", { name: "Your turn: choose your Chancellor" }).waitFor()

  await db("PATCH", `ongoingGames/${code}`, {
    subStatus: "election_voting",
    currentSession: { presidentId: ALICE.uid, chancellorId: BOB.uid },
  })
  // The vote window opens by itself: minimizing only lasted for the previous phase
  await alice.getByRole("button", { name: "Minimize" }).click()
  await alice.getByRole("button", { name: "Your turn: cast your vote" }).waitFor()

  await db("PATCH", `ongoingGames/${code}/currentSession/votes`, { [ALICE.uid]: true })
  await alice.getByRole("button", { name: "A vote is taking place" }).waitFor()

  await db("PATCH", `ongoingGames/${code}`, { status: "gameEnded", subStatus: "gameEnded_liberal" })
  await expect(alice.getByText("won the game").first()).toBeVisible({ timeout: 5000 })
})

test("an executed player who minimized still sees the end screen", async () => {
  const code: string = "700005"
  await db(
    "PUT",
    `ongoingGames/${code}`,
    gameInProgress({
      status: "presidentialPower",
      subStatus: "presidentialPower_execution",
      currentSession: { presidentId: "carol", chancellorId: "eve" },
    }),
  )
  await enterGame(alice, code, "/gameplay")
  await alice.getByRole("button", { name: "Minimize" }).click()
  await alice.getByRole("button", { name: "The President is executing a player" }).waitFor()

  await db("PATCH", `ongoingGames/${code}/players/0`, { isExecuted: true })
  await db("PATCH", `ongoingGames/${code}`, { status: "gameEnded", subStatus: "gameEnded_fascist" })
  await expect(alice.getByText("won the game").first()).toBeVisible({ timeout: 5000 })
})

test("a policy peek ignores another game's cached cards and asks the server", async () => {
  const code: string = "700004"
  await db(
    "PUT",
    `ongoingGames/${code}`,
    gameInProgress({
      status: "presidentialPower",
      subStatus: "presidentialPower_policyPeek",
      currentSession: { presidentId: ALICE.uid, chancellorId: BOB.uid },
      policies: { drawPile: "liberal,fascist,liberal", board: { liberal: 0, fascist: 3 } },
    }),
  )
  await alice.evaluate(() => {
    sessionStorage.setItem("policyPeek", "fascist,fascist,fascist")
    sessionStorage.setItem("policyPeek:999999:3", "fascist,fascist,fascist")
  })

  await enterGame(alice, code, "/gameplay")
  await until(
    async () => (await apiCalls()).some((call) => call.endpoint === "presidentialPower"),
    "the peek request",
  )
  await sleep(500)
  const peeks: Record<string, string | null> = await alice.evaluate(() =>
    Object.fromEntries(
      Object.keys(sessionStorage)
        .filter((key) => key.startsWith("policyPeek"))
        .map((key) => [key, sessionStorage.getItem(key)]),
    ),
  )
  expect(peeks).toEqual({ [`policyPeek:${code}:3`]: "liberal,fascist,liberal" })
})

test("rejoining another game from Game history opens it without reloading the page", async () => {
  const code: string = "700006"
  await db(
    "PUT",
    `ongoingGames/${code}`,
    gameInProgress({ currentSession: { presidentId: BOB.uid } }),
  )
  await setGamesForSelf([
    {
      code,
      createdAt: Date.now(),
      playerCount: 5,
      startedAt: Date.now(),
      visibility: "private",
      status: "election",
      subStatus: "election_presidentChoosingChancellor",
    },
  ])

  await alice.goto("/history")
  // Gone if the page reloads: the switch to the new game must happen in place
  await alice.evaluate(() => ((window as unknown as { marker: boolean }).marker = true))
  await alice.getByRole("button", { name: "Rejoin" }).click()

  await alice.waitForURL("**/gameplay")
  await alice.getByText("The President is choosing their Chancellor").waitFor()
  expect(await alice.evaluate(() => (window as unknown as { marker?: boolean }).marker)).toBe(true)
  await until(async () => (await isConnected(code, ALICE.uid)) === true, "alice connected")
})

test("Game history explains a failed load instead of crashing", async () => {
  await failApi("getGamesForSelf", 500)
  await alice.goto("/history")
  await expect(alice.getByText("Couldn't load your games (500).")).toBeVisible()
  await expect(alice.getByRole("button", { name: "Try again" })).toBeVisible()
})

test("/logout renders on the server without taking the server down", async () => {
  expect((await alice.request.get("/logout")).status()).toBe(200)
  await sleep(1000)
  // Signing out during server rendering used to throw outside the request and kill the process
  expect((await alice.request.get("/login")).status()).toBe(200)
})

test("every player counts down together and moves on at the same time, even with a clock 10s off", async () => {
  const code: string = "700007"
  // Bob's device clock runs 10 seconds fast
  await bob.context().addInitScript(() => {
    const RealDate: DateConstructor = Date
    const skewMs: number = 10_000
    class SkewedDate extends RealDate {
      constructor(...args: []) {
        if (args.length === 0) super(RealDate.now() + skewMs)
        else super(...(args as unknown as [number]))
      }
      static now(): number {
        return RealDate.now() + skewMs
      }
    }
    globalThis.Date = SkewedDate as DateConstructor
  })
  await db(
    "PUT",
    `ongoingGames/${code}`,
    gameInProgress({
      status: "election",
      subStatus: "election_voting",
      currentSession: { presidentId: "carol", chancellorId: "dave" },
    }),
  )
  await Promise.all([enterGame(alice, code, "/gameplay"), enterGame(bob, code, "/gameplay")])
  await alice.getByText("Vote", { exact: true }).first().waitFor()
  await bob.getByText("Vote", { exact: true }).first().waitFor()
  expect(
    await bob.evaluate(() => Date.now() - performance.timeOrigin - performance.now()),
  ).toBeGreaterThan(9000)

  // The last vote is in: the server shows the votes for 6 seconds
  await resetApi()
  const at: number = Date.now() + 6000
  await db("PATCH", `ongoingGames/${code}`, {
    subStatus: "election_votingEnded",
    pendingTransition: { at, kind: "beginLegislativeSession" },
    currentSession: {
      presidentId: "carol",
      chancellorId: "dave",
      hasSucceeded: true,
      votes: { [ALICE.uid]: true, [BOB.uid]: true, carol: true, dave: true, eve: false },
    },
  })

  const timers: Page[] = [alice, bob]
  const shown: (page: Page) => Promise<string> = async (page: Page) =>
    (await page.getByRole("timer").first().innerText()).trim()
  for (const [msBefore, expected] of [
    [4500, ""],
    [2500, "3"],
    [1500, "2"],
    [500, "1"],
  ] as [number, string][]) {
    await sleep(at - msBefore - Date.now())
    for (const page of timers) {
      expect(await shown(page), `${msBefore}ms before the end`).toBe(expected)
    }
  }

  await sleep(at + 1500 - Date.now())
  const advances: { uid: string | undefined; receivedAt: number }[] = (await apiCalls()).filter(
    (call) => call.endpoint === "advance",
  )
  expect(new Set(advances.map((call) => call.uid))).toEqual(new Set([ALICE.uid, BOB.uid]))
  for (const call of advances) {
    expect(
      call.receivedAt,
      `${call.uid} asked ${at - call.receivedAt}ms early`,
    ).toBeGreaterThanOrEqual(at - 100)
    expect(call.receivedAt).toBeLessThan(at + 1000)
  }
})
