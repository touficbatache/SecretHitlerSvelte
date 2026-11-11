import type { LayoutLoad } from "./$types"

import { type AppConfig, readConfig } from "$lib/config"
import { currentUser, initializeFirebase, rtdb } from "$lib/firebase"
import { readGameCode } from "$lib/local_session"
import type { User } from "$lib/user"
import { DEFAULT_SETTINGS, readUserSettings, type UserSettings } from "$lib/user_settings"

/**
 * The app is static: everything runs in the browser. Firebase keeps the login, localStorage the
 * current game, and the player's account their settings. What protects the data is the database rules and the API, which
 * check the login on every read and request.
 */
export const ssr: boolean = false

export const load: LayoutLoad = async (): Promise<{
  apiURL: string
  debugMode: boolean
  gameCode?: string
  settings: UserSettings
  streamerModeEnabled: boolean
  useEmulators: boolean
  user?: User
}> => {
  const config: AppConfig = readConfig()
  initializeFirebase(config)
  const user: User | undefined = await currentUser()
  const settings: UserSettings =
    user !== undefined ? await readUserSettings(rtdb, user.uid) : DEFAULT_SETTINGS

  return {
    apiURL: config.apiURL,
    debugMode: config.debugMode,
    gameCode: user !== undefined ? readGameCode() : undefined,
    settings,
    streamerModeEnabled: settings.streamerMode,
    useEmulators: config.useEmulators,
    user,
  }
}
