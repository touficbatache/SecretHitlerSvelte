import { expect, test } from "@playwright/test"

import {
  createTransitionDriver,
  type Scheduler,
  type TransitionDriver,
} from "$lib/transition_driver"

/** Timers that only run when the test moves the clock, with promises settled in between. */
class FakeClock implements Scheduler {
  now: number = 1_000_000
  private nextId: number = 1
  private timers: Map<number, { at: number; callback: () => void }> = new Map()

  setTimeout(callback: () => void, ms: number): number {
    const id: number = this.nextId++
    this.timers.set(id, { at: this.now + ms, callback })
    return id
  }

  clearTimeout(id: unknown): void {
    this.timers.delete(id as number)
  }

  async advance(ms: number): Promise<void> {
    const end: number = this.now + ms
    for (;;) {
      await settle()
      const due: [number, { at: number; callback: () => void }] | undefined = [...this.timers]
        .filter(([, timer]) => timer.at <= end)
        .sort(([, a], [, b]) => a.at - b.at)[0]
      if (due === undefined) break
      this.timers.delete(due[0])
      this.now = due[1].at
      due[1].callback()
    }
    this.now = end
    await settle()
  }
}

const settle: () => Promise<void> = () => new Promise((resolve) => setImmediate(resolve))

let clock: FakeClock
let calls: { gameCode: string; at: number }[]
let answer: () => Promise<number | undefined>
let driver: TransitionDriver

test.beforeEach(() => {
  clock = new FakeClock()
  calls = []
  answer = async () => undefined
  driver = createTransitionDriver(
    (gameCode: string) => {
      calls.push({ gameCode, at: clock.now })
      return answer()
    },
    () => clock.now,
    clock,
  )
})

test.afterEach(() => driver.stop())

test("asks to move on exactly when the pause ends, on the server clock", async () => {
  driver.follow("123456", clock.now + 5000)
  await clock.advance(4999)
  expect(calls).toEqual([])
  await clock.advance(1)
  expect(calls).toEqual([{ gameCode: "123456", at: 1_005_000 }])
})

test("asks once per pause, however often the game data changes", async () => {
  const at: number = clock.now + 1000
  driver.follow("123456", at)
  driver.follow("123456", at)
  await clock.advance(1000)
  driver.follow("123456", at)
  await clock.advance(5000)
  expect(calls.length).toBe(1)
})

test("asks again when the server says the pause isn't over yet", async () => {
  const serverAt: number = clock.now + 3000
  answer = async () => (clock.now < serverAt ? serverAt : undefined)
  driver.follow("123456", clock.now + 1000) // this device's view of the deadline was early
  await clock.advance(1000)
  expect(calls.length).toBe(1)
  await clock.advance(2100)
  expect(calls.length).toBe(2)
  await clock.advance(10_000)
  expect(calls.length).toBe(2)
})

test("retries every second after a failure, until it works", async () => {
  let failures: number = 2
  answer = async () => {
    if (failures-- > 0) throw new Error("503")
    return undefined
  }
  const consoleError: typeof console.error = console.error
  console.error = () => undefined
  try {
    driver.follow("123456", clock.now)
    await clock.advance(0)
    await clock.advance(1000)
    await clock.advance(1000)
    await clock.advance(5000)
  } finally {
    console.error = consoleError
  }
  expect(calls.length).toBe(3)
})

test("stops when the pause ends some other way, or the player leaves", async () => {
  driver.follow("123456", clock.now + 1000)
  driver.follow("123456", undefined)
  await clock.advance(2000)
  expect(calls).toEqual([])

  driver.follow("123456", clock.now + 1000)
  driver.follow(undefined, clock.now + 1000)
  await clock.advance(2000)
  expect(calls).toEqual([])
})

test("asks right away for a pause that is already over", async () => {
  driver.follow("123456", clock.now - 60_000)
  await clock.advance(0)
  expect(calls.length).toBe(1)
})
