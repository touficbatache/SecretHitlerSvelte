/**
 * What this browser remembers between visits: the game the player is in.
 * Stored in localStorage, which can be unavailable (a private window, blocked site data): reads
 * then find nothing and writes do nothing, so the app still works, it just doesn't remember.
 */

const GAME_CODE_KEY: string = "gameCode"

function read(key: string): string | undefined {
  try {
    return localStorage.getItem(key) ?? undefined
  } catch {
    return undefined
  }
}

function write(key: string, value: string | undefined): void {
  try {
    if (value === undefined) {
      localStorage.removeItem(key)
    } else {
      localStorage.setItem(key, value)
    }
  } catch {
    // Not remembered, see above
  }
}

/** The game this player is in, if any. */
export function readGameCode(): string | undefined {
  return read(GAME_CODE_KEY)
}

export function writeGameCode(code: string | undefined): void {
  write(GAME_CODE_KEY, code === "" ? undefined : code)
}

/** Forgets everything, on sign-out: the next player on this device starts fresh. */
export function clearLocalSession(): void {
  writeGameCode(undefined)
}
