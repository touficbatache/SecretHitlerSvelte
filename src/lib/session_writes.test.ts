import { expect, test } from "@playwright/test"

import { writeSession } from "$lib/session_writes"

interface PendingRequest {
  path: string
  body: unknown
  answer: () => void
  fail: () => void
}

interface FakeServer {
  send: typeof fetch
  sent: PendingRequest[]
}

/** A fake fetch that only answers when the test says so, and records what was sent when. */
function fakeServer(): FakeServer {
  const sent: PendingRequest[] = []
  const send: typeof fetch = ((path: string, init?: RequestInit) =>
    new Promise<Response>((resolve, reject) => {
      sent.push({
        path,
        body: JSON.parse(String(init?.body)),
        answer: () => resolve(new Response("{}")),
        fail: () => reject(new TypeError("Failed to fetch")),
      })
    })) as typeof fetch
  return { send, sent }
}

const tick: () => Promise<void> = () => new Promise((resolve) => setTimeout(resolve, 0))

test("a session write waits for the previous one's response", async () => {
  const server: FakeServer = fakeServer()
  const login: Promise<Response> = writeSession("/api/login", { token: "t" }, server.send)
  const join: Promise<Response> = writeSession("/api/joinGame", { code: "700006" }, server.send)
  await tick()

  // The rejoin isn't sent while the login refresh is in flight
  expect(server.sent.map((r) => r.path)).toEqual(["/api/login"])

  server.sent[0].answer()
  await login
  await tick()
  expect(server.sent.map((r) => r.path)).toEqual(["/api/login", "/api/joinGame"])
  expect(server.sent[1].body).toEqual({ code: "700006" })

  server.sent[1].answer()
  await join
})

test("a failed session write doesn't hold back the next one", async () => {
  const server: FakeServer = fakeServer()
  const failing: Promise<Response> = writeSession("/api/login", { token: "t" }, server.send)
  const next: Promise<Response> = writeSession("/api/joinGame", { code: "1" }, server.send)
  await tick()

  server.sent[0].fail()
  await expect(failing).rejects.toThrow("Failed to fetch")
  await tick()
  expect(server.sent.map((r) => r.path)).toEqual(["/api/login", "/api/joinGame"])

  server.sent[1].answer()
  await next
})
