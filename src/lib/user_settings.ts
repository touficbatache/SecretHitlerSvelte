import { type Database, get, ref, update } from "firebase/database"

/**
 * A player's settings, saved in their account (users/{uid}/settings in the database), so they
 * follow them on every device. Only the player can read or write them (database.rules.json).
 */
export interface UserSettings {
  streamerMode: boolean
  /** Default of "Skip long intro" when starting a game. */
  skipLongIntro: boolean
  /** Default of "Hide avatars in info" when starting a game. */
  hidePicsGameInfo: boolean
}

export const DEFAULT_SETTINGS: UserSettings = {
  streamerMode: false,
  skipLongIntro: false,
  hidePicsGameInfo: false,
}

/** How long to wait for the settings before using the defaults, such as when offline. */
const READ_TIMEOUT_MS: number = 3000

/** Settings as stored: anything missing or malformed reads as its default. */
export function parseSettings(stored: unknown): UserSettings {
  const value: Record<string, unknown> =
    typeof stored === "object" && stored !== null ? (stored as Record<string, unknown>) : {}
  const flag: (name: keyof UserSettings) => boolean = (name: keyof UserSettings) =>
    typeof value[name] === "boolean" ? (value[name] as boolean) : DEFAULT_SETTINGS[name]
  return {
    streamerMode: flag("streamerMode"),
    skipLongIntro: flag("skipLongIntro"),
    hidePicsGameInfo: flag("hidePicsGameInfo"),
  }
}

/** The player's settings, or the defaults if they can't be read in time. */
export async function readUserSettings(db: Database, uid: string): Promise<UserSettings> {
  const timeout: Promise<undefined> = new Promise((resolve) =>
    setTimeout(() => resolve(undefined), READ_TIMEOUT_MS),
  )
  try {
    const stored: unknown = await Promise.race([
      get(ref(db, `users/${uid}/settings`)).then((snapshot) => snapshot.val()),
      timeout,
    ])
    return parseSettings(stored)
  } catch (error) {
    console.warn("Couldn't read the player's settings, using the defaults:", error)
    return DEFAULT_SETTINGS
  }
}

export async function saveUserSetting(
  db: Database,
  uid: string,
  name: keyof UserSettings,
  value: boolean,
): Promise<void> {
  await update(ref(db, `users/${uid}/settings`), { [name]: value })
}
