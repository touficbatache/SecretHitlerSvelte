import type { FirebaseOptions } from "@firebase/app"

import type { LayoutServerLoad } from "./$types"

import config from "$lib/server/config"
import type { User } from "$lib/user"

export const load: LayoutServerLoad = async ({
  locals,
}): Promise<{
  apiURL: string
  debugMode?: boolean
  firebaseAppConfig?: FirebaseOptions
  gameCode?: string
  recaptchaSiteKey?: string
  streamerModeEnabled?: boolean
  useEmulators?: boolean
  user?: User
}> => {
  const { user, gameCode, streamerModeEnabled } = locals

  return {
    apiURL: config.apiURL,
    debugMode: config.debugMode,
    firebaseAppConfig: config.firebaseAppConfig,
    gameCode,
    recaptchaSiteKey: config.recaptchaSiteKey,
    streamerModeEnabled,
    useEmulators: config.useEmulators,
    user,
  }
}
