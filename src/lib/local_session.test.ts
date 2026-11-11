import { expect, test } from "@playwright/test"

import { clearLocalSession, readGameCode, writeGameCode } from "$lib/local_session"

function fakeStorage(): Storage {
  const items: Map<string, string> = new Map()
  return {
    getItem: (key: string) => items.get(key) ?? null,
    setItem: (key: string, value: string) => void items.set(key, value),
    removeItem: (key: string) => void items.delete(key),
    clear: () => items.clear(),
    key: () => null,
    get length() {
      return items.size
    },
  }
}

function blockedStorage(): Storage {
  const fail: () => never = () => {
    throw new DOMException("The operation is insecure.", "SecurityError")
  }
  return { ...fakeStorage(), getItem: fail, setItem: fail, removeItem: fail }
}

test("remembers the current game", () => {
  globalThis.localStorage = fakeStorage()
  writeGameCode("123456")
  expect(readGameCode()).toBe("123456")

  writeGameCode("")
  expect(readGameCode()).toBeUndefined()
})

test("signing out forgets the game", () => {
  globalThis.localStorage = fakeStorage()
  writeGameCode("123456")
  clearLocalSession()
  expect(readGameCode()).toBeUndefined()
})

test("blocked storage doesn't break the app: nothing is remembered", () => {
  globalThis.localStorage = blockedStorage()
  expect(() => writeGameCode("123456")).not.toThrow()
  expect(readGameCode()).toBeUndefined()
})
