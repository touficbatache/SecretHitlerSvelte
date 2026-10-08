import { expect, test } from "@playwright/test"

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

test.describe("power cache", () => {
  const useStorage: (storage: unknown) => void = (storage: unknown) =>
    Object.defineProperty(globalThis, "sessionStorage", { value: storage, configurable: true })

  test.beforeEach(() => useStorage(memoryStorage()))
  test.afterEach(() => delete (globalThis as { sessionStorage?: Storage }).sessionStorage)

  test("keys entries by game and enacted policy count", () => {
    expect(powerCacheKey("policyPeek", "111111", 3)).not.toBe(
      powerCacheKey("policyPeek", "222222", 3),
    )
    expect(powerCacheKey("policyPeek", "111111", 3)).not.toBe(
      powerCacheKey("policyPeek", "111111", 4),
    )
  })

  test("never returns another game's or round's peek, and clears it", () => {
    sessionStorage.setItem("policyPeek", "liberal,liberal,liberal") // written by older versions
    writePowerCache(powerCacheKey("policyPeek", "111111", 3), "fascist,fascist,fascist")
    writePowerCache(powerCacheKey("investigation", "111111", 3), "{}")

    expect(readPowerCache("policyPeek", powerCacheKey("policyPeek", "222222", 3))).toBe(null)
    expect(Object.keys(sessionStorage)).toEqual([powerCacheKey("investigation", "111111", 3)])
  })

  test("returns the same round's entry, so a reload keeps the peeked cards", () => {
    const key: string = powerCacheKey("policyPeek", "222222", 3)
    writePowerCache(key, "liberal,fascist,liberal")
    expect(readPowerCache("policyPeek", key)).toBe("liberal,fascist,liberal")
  })

  test("doesn't throw when storage is blocked", () => {
    useStorage(
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
