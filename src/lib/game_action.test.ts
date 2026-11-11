import { expect, test } from "@playwright/test"

import { type ActionResult, readApiError, sendGameAction, type SendOptions } from "$lib/game_action"

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status })
}

function apiError(status: number, code: string): Response {
  return json(status, { error: { code, message: `${code} message` } })
}

interface FakeApi {
  post: (body: string) => Promise<Response>
  bodies: any[]
}

/** A fake POST /action: answers with `responses` in order, and records the bodies it got. */
function fakePost(responses: (Response | Error)[]): FakeApi {
  const bodies: any[] = []
  return {
    bodies,
    post: async (body: string) => {
      bodies.push(JSON.parse(body))
      const next: Response | Error | undefined = responses.shift()
      if (next === undefined) throw new Error("no more responses")
      if (next instanceof Error) throw next
      return next
    },
  }
}

const options: SendOptions = { newActionId: () => "action-1", wait: async () => undefined }

test("sends the move with the game code and an id, and returns the response", async () => {
  const api: FakeApi = fakePost([
    json(200, { code: "123456", policies: "liberal,fascist,liberal" }),
  ])
  const result: ActionResult = await sendGameAction(
    api.post,
    "123456",
    { type: "usePower" },
    options,
  )
  expect(result).toEqual({
    ok: true,
    data: { code: "123456", policies: "liberal,fascist,liberal" },
  })
  expect(api.bodies).toEqual([
    { code: "123456", actionId: "action-1", action: { type: "usePower" } },
  ])
})

test("a network failure or a busy game is retried with the same id", async () => {
  const api: FakeApi = fakePost([
    new TypeError("Failed to fetch"),
    apiError(409, "GAME_BUSY"),
    json(200, { code: "123456" }),
  ])
  const result: ActionResult = await sendGameAction(
    api.post,
    "123456",
    { type: "vote", ja: true },
    options,
  )
  expect(result.ok).toBe(true)
  expect(api.bodies.map((body) => body.actionId)).toEqual(["action-1", "action-1", "action-1"])
})

test("gives up after the last retry, with the last error", async () => {
  const api: FakeApi = fakePost([
    new TypeError("offline"),
    new TypeError("offline"),
    new TypeError("offline"),
  ])
  const waits: number[] = []
  const result: ActionResult = await sendGameAction(
    api.post,
    "123456",
    { type: "vote", ja: true },
    { ...options, retryDelays: [100, 200], wait: async (ms: number) => void waits.push(ms) },
  )
  expect(result.ok).toBe(false)
  expect(!result.ok && result.error.code).toBe("NETWORK")
  expect(waits).toEqual([100, 200])
})

test("a move the rules refuse isn't retried", async () => {
  for (const code of ["WRONG_PHASE", "NOT_YOUR_TURN", "PAUSED", "INELIGIBLE", "INTERNAL"]) {
    const api: FakeApi = fakePost([apiError(409, code)])
    const result: ActionResult = await sendGameAction(
      api.post,
      "123456",
      { type: "nominate", chancellorId: "bob" },
      options,
    )
    expect(result).toEqual({ ok: false, error: { code, status: 409, message: `${code} message` } })
    expect(api.bodies).toHaveLength(1)
  }
})

test("each move gets a new id", async () => {
  const api: FakeApi = fakePost([json(200, {}), json(200, {})])
  await sendGameAction(api.post, "123456", { type: "vote", ja: true }, { wait: options.wait })
  await sendGameAction(api.post, "123456", { type: "vote", ja: true }, { wait: options.wait })
  expect(api.bodies[0].actionId).not.toBe(api.bodies[1].actionId)
  expect(api.bodies[0].actionId).toMatch(/^[0-9a-f-]{36}$/)
})

test("an error that isn't the API's still gets a code", async () => {
  expect(await readApiError(new Response("<html>Bad gateway</html>", { status: 502 }))).toEqual({
    code: "INTERNAL",
    status: 502,
    message: "<html>Bad gateway</html>",
  })
  expect(await readApiError(new Response("nope", { status: 400 }))).toMatchObject({
    code: "INVALID_REQUEST",
  })
})
