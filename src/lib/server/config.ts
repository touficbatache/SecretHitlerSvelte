import "dotenv/config"
import type { FirebaseOptions } from "@firebase/app"

import { validateConfig } from "$lib/server/auditors/config"
import type { FirebaseServerConfig } from "$lib/server/firebase"

export interface Config {
  apiURL: string
  debugMode: boolean
  firebaseAppConfig: FirebaseOptions
  firebaseServerConfig: FirebaseServerConfig
  recaptchaSiteKey: string
}

const [config, error] = validateConfig({
  apiURL: process.env["PUBLIC_API_URL"],
  debugMode: process.env["PUBLIC_DEBUG"],
  firebaseAppConfig: process.env["PUBLIC_FIREBASE_CONFIG"],
  firebaseServerConfig: process.env["PRIVATE_FIREBASE_SERVER_CONFIG"],
  recaptchaSiteKey: process.env["PUBLIC_RECAPTCHA_SITE_KEY"],
}) as [Config, unknown]

if (error !== null) {
  console.error(
    `Error in configuration:\n${JSON.stringify(config, null, 2)}\nError:\n${JSON.stringify(
      error,
      null,
      2,
    )}`,
  )
  process.exit(-1)
}

export default config
