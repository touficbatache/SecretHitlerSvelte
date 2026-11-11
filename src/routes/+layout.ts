import type { LayoutLoad } from "./$types"

import { type AppConfig, readConfig } from "$lib/config"
import { currentUser, initializeFirebase } from "$lib/firebase"
import { readGameCode, readStreamerMode } from "$lib/local_session"
import type { User } from "$lib/user"

/**
 * The app is static: everything runs in the browser. Firebase keeps the login, localStorage the
 * current game and streamer mode. What protects the data is the database rules and the API, which
 * check the login on every read and request.
 */
export const ssr: boolean = false

export const load: LayoutLoad = async (): Promise<{
  apiURL: string
  debugMode: boolean
  gameCode?: string
  streamerModeEnabled: boolean
  useEmulators: boolean
  user?: User
}> => {
  const config: AppConfig = readConfig()
  initializeFirebase(config)
  const user: User | undefined = await currentUser()

  return {
    apiURL: config.apiURL,
    debugMode: config.debugMode,
    gameCode: user !== undefined ? readGameCode() : undefined,
    streamerModeEnabled: readStreamerMode(),
    useEmulators: config.useEmulators,
    user,
  }
}
