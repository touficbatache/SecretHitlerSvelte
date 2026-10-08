import { expect, type Locator, type Page } from "@playwright/test"

export const PROJECT_ID: string = "demo-shtest"
const AUTH_EMULATOR: string = "http://127.0.0.1:9099"
const DATABASE_EMULATOR: string = "http://127.0.0.1:9000"
const DATABASE_NAMESPACE: string = "ns=demo-shtest-default-rtdb"
export const FAKE_API_PORT: number = 8790
const FAKE_API: string = `http://127.0.0.1:${FAKE_API_PORT}`
const ADMIN: Record<string, string> = {
  Authorization: "Bearer owner",
  "Content-Type": "application/json",
}

export interface TestUser {
  uid: string
  name: string
  phoneNumber: string
}

export const ALICE: TestUser = { uid: "alice-uid", name: "alice", phoneNumber: "+15550000001" }
export const BOB: TestUser = { uid: "bob-uid", name: "bob", phoneNumber: "+15550000002" }

export const sleep: (ms: number) => Promise<void> = (ms) => new Promise((r) => setTimeout(r, ms))

/** Reads or writes the database emulator as an admin, bypassing the security rules. */
export async function db(method: string, path: string, body?: unknown): Promise<any> {
  const res: Response = await fetch(`${DATABASE_EMULATOR}/${path}.json?${DATABASE_NAMESPACE}`, {
    method,
    headers: ADMIN,
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const text: string = await res.text()
  if (!res.ok) throw new Error(`${method} ${path}: ${res.status} ${text}`)
  return JSON.parse(text)
}

export const isConnected: (code: string, uid: string) => Promise<boolean | null> = (code, uid) =>
  db("GET", `ongoingGames/${code}/connected/${uid}`)

/** Polls until `predicate` holds. */
export async function until(
  predicate: () => Promise<boolean> | boolean,
  what: string,
  timeoutMs: number = 15_000,
): Promise<void> {
  const start: number = Date.now()
  while (Date.now() - start < timeoutMs) {
    if (await predicate()) return
    await sleep(100)
  }
  throw new Error(`Timed out waiting for: ${what}`)
}

/** Records every value written to a database node, through the emulator's streaming API. */
export function recordValues(path: string): { values: unknown[]; stop: () => void } {
  const values: unknown[] = []
  const controller: AbortController = new AbortController()
  ;(async () => {
    const res: Response = await fetch(`${DATABASE_EMULATOR}/${path}.json?${DATABASE_NAMESPACE}`, {
      headers: { ...ADMIN, Accept: "text/event-stream" },
      signal: controller.signal,
    })
    const decoder: TextDecoder = new TextDecoder()
    let buffer: string = ""
    for await (const chunk of res.body as unknown as AsyncIterable<Uint8Array>) {
      buffer += decoder.decode(chunk, { stream: true })
      let end: number
      while ((end = buffer.indexOf("\n\n")) >= 0) {
        const event: string = buffer.slice(0, end)
        buffer = buffer.slice(end + 2)
        const data: string | undefined = event.split("\n").find((l) => l.startsWith("data: "))
        if (event.startsWith("event: put") && data) values.push(JSON.parse(data.slice(6)).data)
      }
    }
  })().catch(() => undefined)
  return { values, stop: () => controller.abort() }
}

export async function createUsers(users: TestUser[]): Promise<void> {
  const res: Response = await fetch(
    `${AUTH_EMULATOR}/identitytoolkit.googleapis.com/v1/projects/${PROJECT_ID}/accounts:batchCreate`,
    {
      method: "POST",
      headers: ADMIN,
      body: JSON.stringify({
        users: users.map((u) => ({
          localId: u.uid,
          phoneNumber: u.phoneNumber,
          displayName: u.name,
        })),
      }),
    },
  )
  if (!res.ok) throw new Error(`Creating users: ${res.status} ${await res.text()}`)
}

async function latestVerificationCode(phoneNumber: string): Promise<string | undefined> {
  const res: Response = await fetch(
    `${AUTH_EMULATOR}/emulator/v1/projects/${PROJECT_ID}/verificationCodes`,
  )
  const { verificationCodes } = (await res.json()) as {
    verificationCodes: { phoneNumber: string; code: string }[]
  }
  return verificationCodes.filter((c) => c.phoneNumber === phoneNumber).at(-1)?.code
}

/** Signs in through the login page, reading the SMS code from the auth emulator. */
export async function signIn(page: Page, user: TestUser): Promise<void> {
  await page.goto("/login")
  const sendButton: Locator = page.getByRole("button", { name: "Send OTP" })
  // Typing before the page hydrates is lost, so retype until the app has taken the number
  await until(async () => {
    await page.locator('input[type="tel"]').fill(user.phoneNumber)
    return sendButton.isEnabled()
  }, "the login form")
  const previousCode: string | undefined = await latestVerificationCode(user.phoneNumber)
  await sendButton.click()
  let code: string | undefined
  await until(async () => {
    code = await latestVerificationCode(user.phoneNumber)
    return code !== undefined && code !== previousCode
  }, `SMS code for ${user.name}`)
  await page.locator("#pin-input-0").click()
  await page.keyboard.type(code as string)
  await page.getByRole("button", { name: "Sign in" }).click()
  await page.waitForURL((url) => url.pathname !== "/login")
}

/** Makes `code` the player's current game, like joining or rejoining it, and opens `path`. */
export async function enterGame(page: Page, code: string, path: string): Promise<void> {
  await page.evaluate(
    (code) =>
      fetch("/api/joinGame", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      }),
    code,
  )
  await page.goto(path)
}

export async function apiCalls(): Promise<{ endpoint: string; body: any }[]> {
  return (await fetch(`${FAKE_API}/__calls`)).json()
}

export async function resetApi(): Promise<void> {
  await fetch(`${FAKE_API}/__reset`, { method: "POST" })
}

export async function failApi(endpoint: string, status: number): Promise<void> {
  await fetch(`${FAKE_API}/__fail`, { method: "POST", body: JSON.stringify({ endpoint, status }) })
}

export async function setGamesForSelf(games: unknown[]): Promise<void> {
  await fetch(`${FAKE_API}/__games`, { method: "POST", body: JSON.stringify(games) })
}

export const reconnectBanner: (page: Page) => Locator = (page) =>
  page.getByRole("status").filter({ hasText: "to reconnect" })

export async function expectBannerText(page: Page, text: string): Promise<void> {
  await expect(reconnectBanner(page)).toHaveText(text, { timeout: 8000 })
}

interface PlayerRecord {
  id: string
  name: string
  role: string
  assetReference: string
  isExecuted?: boolean
}

/** A 5-player game in progress: alice and bob are real players, the others only exist here. */
export function gameInProgress(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  const players: PlayerRecord[] = [
    { id: ALICE.uid, name: "alice", role: "liberal", assetReference: "liberal_1" },
    { id: BOB.uid, name: "bob", role: "liberal", assetReference: "liberal_2" },
    { id: "carol", name: "carol", role: "fascist", assetReference: "fascist_1" },
    { id: "dave", name: "dave", role: "hitler", assetReference: "hitler" },
    { id: "eve", name: "eve", role: "liberal", assetReference: "liberal_3" },
  ]
  return {
    ownerId: ALICE.uid,
    createdAt: Date.now(),
    startedAt: Date.now() - 60_000,
    players,
    connected: { [ALICE.uid]: false, [BOB.uid]: false, carol: true, dave: true, eve: true },
    gameType: "fiveSix",
    executiveActions: { 3: "policyPeek", 4: "execution", 5: "execution" },
    settings: { hidePicsGameInfo: false, skipLongIntro: true },
    visibility: "private",
    electionTracker: 0,
    status: "election",
    subStatus: "election_presidentChoosingChancellor",
    currentSession: { presidentId: "carol" },
    policies: {
      drawPile: "liberal,liberal,fascist,fascist,fascist",
      board: { liberal: 0, fascist: 0 },
    },
    ...overrides,
  }
}
