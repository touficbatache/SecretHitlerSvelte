import type { FirebaseOptions } from "@firebase/app"

import type { LayoutServerLoad } from "./$types"

import config from "$lib/server/config"
import type { User } from "$lib/user"

export const load: LayoutServerLoad = async ({
  locals,
}): Promise<{
  devMode?: boolean
  firebaseAppConfig?: FirebaseOptions
  gameCode?: string
  recaptchaSiteKey?: string
  user?: User
}> => {
  const { user, gameCode } = locals

  return {
    devMode: config.devMode,
    firebaseAppConfig: config.firebaseAppConfig,
    gameCode,
    recaptchaSiteKey: config.recaptchaSiteKey,
    user,
  }
}
