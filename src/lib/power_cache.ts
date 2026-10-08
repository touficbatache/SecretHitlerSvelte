/**
 * Remembers what a presidential power revealed to the President (the peeked policies, the
 * investigated membership), so reloading the page doesn't lose it.
 *
 * Entries are keyed by game and enacted policy count, so a later power, or another game in
 * the same tab, never shows a stale result.
 */
export type PowerCacheName = "policyPeek" | "investigation"

export function powerCacheKey(
  name: PowerCacheName,
  gameCode: string,
  enactedPolicyCount: number,
): string {
  return `${name}:${gameCode}:${enactedPolicyCount}`
}

/** Reads `key`, and removes every other entry of the same power, which can only be stale. */
export function readPowerCache(name: PowerCacheName, key: string): string | null {
  try {
    for (const storedKey of Object.keys(sessionStorage)) {
      // Unprefixed keys were written by earlier versions, without a game or round
      if ((storedKey === name || storedKey.startsWith(`${name}:`)) && storedKey !== key) {
        sessionStorage.removeItem(storedKey)
      }
    }
    return sessionStorage.getItem(key)
  } catch {
    return null
  }
}

export function writePowerCache(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value)
  } catch {
    // Storage is full or blocked: the result just won't survive a reload
  }
}

export function removePowerCache(key: string) {
  try {
    sessionStorage.removeItem(key)
  } catch {
    // Nothing to clean up if storage is blocked
  }
}
