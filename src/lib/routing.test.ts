import { expect, test } from "@playwright/test"

import { isGameRoute, routeForPhase } from "$lib/routing"

test.describe("routeForPhase", () => {
  test("sends players without a game home", () => {
    expect(routeForPhase(undefined, "election")).toBe("/")
  })

  test("matches each status to its page", () => {
    expect(routeForPhase("123456", "waiting")).toBe("/waitingRoom")
    expect(routeForPhase("123456", "settingUp")).toBe("/intro")
    expect(routeForPhase("123456", "election")).toBe("/gameplay")
    expect(routeForPhase("123456", "presidentialPower")).toBe("/gameplay")
    expect(routeForPhase("123456", "gameEnded")).toBe("/gameplay")
  })

  test("stays put while loading or while the game is being closed", () => {
    expect(routeForPhase("123456", undefined)).toBe(undefined)
    expect(routeForPhase("123456", "deleted")).toBe(undefined)
  })
})

test.describe("isGameRoute", () => {
  test("uses SvelteKit route ids, which start with a slash", () => {
    expect(isGameRoute("/gameplay")).toBe(true)
    expect(isGameRoute("/waitingRoom")).toBe(true)
    expect(isGameRoute("/intro")).toBe(true)
    expect(isGameRoute("gameplay")).toBe(false)
    expect(isGameRoute("/history")).toBe(false)
    expect(isGameRoute(null)).toBe(false)
  })
})
