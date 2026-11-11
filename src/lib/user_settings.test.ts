import { expect, test } from "@playwright/test"

import { DEFAULT_SETTINGS, parseSettings } from "$lib/user_settings"

test("a player without saved settings gets the defaults", () => {
  expect(parseSettings(null)).toEqual(DEFAULT_SETTINGS)
  expect(parseSettings(undefined)).toEqual(DEFAULT_SETTINGS)
  expect(DEFAULT_SETTINGS).toEqual({
    streamerMode: false,
    skipLongIntro: false,
    hidePicsGameInfo: false,
  })
})

test("saved settings are used, and anything missing or malformed reads as its default", () => {
  expect(
    parseSettings({ streamerMode: true, skipLongIntro: true, hidePicsGameInfo: true }),
  ).toEqual({ streamerMode: true, skipLongIntro: true, hidePicsGameInfo: true })
  expect(parseSettings({ streamerMode: true, skipLongIntro: "yes", other: true })).toEqual({
    streamerMode: true,
    skipLongIntro: false,
    hidePicsGameInfo: false,
  })
  expect(parseSettings("true")).toEqual(DEFAULT_SETTINGS)
})
