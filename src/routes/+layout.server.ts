import type { FirebaseOptions } from "@firebase/app"

import type { LayoutServerLoad } from "./$types"

import * as ApiClient from "$lib/api_client"
import config from "$lib/server/config"
import type { User } from "$lib/user"

export const load: LayoutServerLoad = async ({
  locals,
}): Promise<{
  apiURL: string
  devMode?: boolean
  firebaseAppConfig?: FirebaseOptions
  gameCode?: string
  recaptchaSiteKey?: string
  user?: User
}> => {
  const { user, gameCode } = locals

  if (user?.token) {
    ApiClient.init(config.apiURL, user.token)
  }

  return {
    apiURL: config.apiURL,
    devMode: config.devMode,
    firebaseAppConfig: config.firebaseAppConfig,
    gameCode,
    recaptchaSiteKey: config.recaptchaSiteKey,
    user,
  }
}
