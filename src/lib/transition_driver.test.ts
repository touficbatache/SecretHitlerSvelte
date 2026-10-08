import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { createTransitionDriver, type TransitionDriver } from "$lib/transition_driver"

describe("transition driver", () => {
  let now: number
  let calls: { gameCode: string; at: number }[]
  let answer: () => Promise<number | undefined>
  let driver: TransitionDriver

  beforeEach(() => {
    vi.useFakeTimers()
    now = 1_000_000
    calls = []
    answer = async () => undefined
    driver = createTransitionDriver(
      (gameCode: string) => {
        calls.push({ gameCode, at: now })
        return answer()
      },
      () => now,
    )
  })

  afterEach(() => {
    driver.stop()
    vi.useRealTimers()
  })

  async function advanceTime(ms: number) {
    now += ms
    await vi.advanceTimersByTimeAsync(ms)
  }

  it("asks to move on exactly when the pause ends, on the server clock", async () => {
    driver.follow("123456", now + 5000)
    await advanceTime(4999)
    expect(calls).toEqual([])
    await advanceTime(1)
    expect(calls).toEqual([{ gameCode: "123456", at: 1_005_000 }])
  })

  it("asks once per pause, however often the game data changes", async () => {
    const at: number = now + 1000
    driver.follow("123456", at)
    driver.follow("123456", at)
    await advanceTime(1000)
    driver.follow("123456", at)
    await advanceTime(5000)
    expect(calls.length).toBe(1)
  })

  it("asks again when the server says the pause isn't over yet", async () => {
    const serverAt: number = now + 3000
    answer = async () => (now < serverAt ? serverAt : undefined)
    driver.follow("123456", now + 1000) // this device's view of the deadline was early
    await advanceTime(1000)
    expect(calls.length).toBe(1)
    await advanceTime(2100)
    expect(calls.length).toBe(2)
    await advanceTime(10_000)
    expect(calls.length).toBe(2)
  })

  it("retries every second after a failure, until it works", async () => {
    let failures: number = 2
    answer = async () => {
      if (failures-- > 0) throw new Error("503")
      return undefined
    }
    vi.spyOn(console, "error").mockImplementation(() => undefined)
    driver.follow("123456", now)
    await advanceTime(0)
    await advanceTime(1000)
    await advanceTime(1000)
    await advanceTime(5000)
    expect(calls.length).toBe(3)
  })

  it("stops when the pause ends some other way, or the player leaves", async () => {
    driver.follow("123456", now + 1000)
    driver.follow("123456", undefined)
    await advanceTime(2000)
    expect(calls).toEqual([])

    driver.follow("123456", now + 1000)
    driver.follow(undefined, now + 1000)
    await advanceTime(2000)
    expect(calls).toEqual([])
  })

  it("asks right away for a pause that is already over", async () => {
    driver.follow("123456", now - 60_000)
    await advanceTime(0)
    expect(calls.length).toBe(1)
  })
})
