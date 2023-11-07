import type { FirebaseOptions } from "@firebase/app"

import config from "$lib/server/config"
import type { User } from "$lib/user"

import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = async ({
  locals,
}): Promise<{
  devMode?: boolean
  firebaseAppConfig?: FirebaseOptions
  gameCode?: string
  lastUpdate: number
  user?: User
}> => {
  const { user, gameCode } = locals

  const lastUpdate = Date.now()

  return {
    devMode: config.devMode,
    firebaseAppConfig: config.firebaseAppConfig,
    gameCode,
    lastUpdate,
    user,
  }
}
