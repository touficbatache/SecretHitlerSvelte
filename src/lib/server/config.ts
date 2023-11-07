import "dotenv/config"
import type { FirebaseOptions } from "@firebase/app"

import { validateConfig } from "$lib/server/auditors/config"
import type { FirebaseServerConfig } from "$lib/server/firebase"

export interface Config {
  devMode: boolean
  firebaseAppConfig: FirebaseOptions
  firebaseServerConfig: FirebaseServerConfig
}

const [config, error] = validateConfig({
  devMode: process.env["PUBLIC_DEV"],
  firebaseAppConfig: process.env["PUBLIC_FIREBASE_CONFIG"],
  firebaseServerConfig: process.env["FIREBASE_SERVER_CONFIG"],
}) as [Config, unknown]

if (error !== null) {
  console.error(
    `Error in configuration:\n${JSON.stringify(config, null, 2)}\nError:\n${JSON.stringify(
      error,
      null,
      2,
    )}`,
  )
  // process.exit(-1)
}

export default config
