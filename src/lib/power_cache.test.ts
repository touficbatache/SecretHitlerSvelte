import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { powerCacheKey, readPowerCache, writePowerCache } from "$lib/power_cache"

/** A minimal sessionStorage: keys are enumerable, like the browser's. */
function memoryStorage(): Storage {
  const storage: Record<string, string> = {}
  Object.defineProperties(storage, {
    getItem: { value: (key: string) => (key in storage ? storage[key] : null) },
    setItem: { value: (key: string, value: string) => (storage[key] = String(value)) },
    removeItem: { value: (key: string) => delete storage[key] },
  })
  return storage as unknown as Storage
}

describe("power cache", () => {
  beforeEach(() => vi.stubGlobal("sessionStorage", memoryStorage()))
  afterEach(() => vi.unstubAllGlobals())

  it("keys entries by game and enacted policy count", () => {
    expect(powerCacheKey("policyPeek", "111111", 3)).not.toBe(
      powerCacheKey("policyPeek", "222222", 3),
    )
    expect(powerCacheKey("policyPeek", "111111", 3)).not.toBe(
      powerCacheKey("policyPeek", "111111", 4),
    )
  })

  it("never returns another game's or round's peek, and clears it", () => {
    sessionStorage.setItem("policyPeek", "liberal,liberal,liberal") // written by older versions
    writePowerCache(powerCacheKey("policyPeek", "111111", 3), "fascist,fascist,fascist")
    writePowerCache(powerCacheKey("investigation", "111111", 3), "{}")

    expect(readPowerCache("policyPeek", powerCacheKey("policyPeek", "222222", 3))).toBe(null)
    expect(Object.keys(sessionStorage)).toEqual([powerCacheKey("investigation", "111111", 3)])
  })

  it("returns the same round's entry, so a reload keeps the peeked cards", () => {
    const key: string = powerCacheKey("policyPeek", "222222", 3)
    writePowerCache(key, "liberal,fascist,liberal")
    expect(readPowerCache("policyPeek", key)).toBe("liberal,fascist,liberal")
  })

  it("doesn't throw when storage is blocked", () => {
    vi.stubGlobal(
      "sessionStorage",
      new Proxy(
        {},
        {
          get() {
            throw new Error("SecurityError")
          },
          ownKeys() {
            throw new Error("SecurityError")
          },
        },
      ),
    )
    expect(readPowerCache("policyPeek", "key")).toBe(null)
    expect(() => writePowerCache("key", "value")).not.toThrow()
  })
})
