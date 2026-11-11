import type { FirebaseOptions } from "firebase/app"

import { env } from "$env/dynamic/public"

/** The app's settings, from the PUBLIC_ environment variables (see example.env). */
export interface AppConfig {
  apiURL: string
  /** Turns on the App Check debug token. */
  debugMode: boolean
  /** Use the local Firebase emulators instead of the project's services. */
  useEmulators: boolean
  firebaseAppConfig: FirebaseOptions
  recaptchaSiteKey: string
}

/**
 * Reads the settings. The app is static: they're the values the app was built with, so a missing
 * or malformed one throws right away, with its name.
 */
export function readConfig(): AppConfig {
  return {
    apiURL: url("PUBLIC_API_URL"),
    debugMode: flag("PUBLIC_DEBUG"),
    useEmulators: flag("PUBLIC_USE_EMULATORS"),
    firebaseAppConfig: firebaseOptions("PUBLIC_FIREBASE_CONFIG"),
    recaptchaSiteKey: required("PUBLIC_RECAPTCHA_SITE_KEY"),
  }
}

type PublicName = `PUBLIC_${string}`

function required(name: PublicName): string {
  const value: string | undefined = env[name]
  if (value === undefined || value.trim() === "") {
    throw new Error(`Missing setting ${name}. See example.env.`)
  }
  return value
}

function url(name: PublicName): string {
  const value: string = required(name)
  if (!/^https?:\/\/[^\s]+$/.test(value)) {
    throw new Error(`${name} must be an http(s) URL, not "${value}".`)
  }
  return value
}

function flag(name: PublicName): boolean {
  return env[name] === "true"
}

function firebaseOptions(name: PublicName): FirebaseOptions {
  let options: FirebaseOptions
  try {
    options = JSON.parse(required(name))
  } catch (error) {
    throw new Error(`${name} must be the Firebase project's JSON config. ${error}`)
  }
  for (const key of ["apiKey", "authDomain", "databaseURL", "projectId", "appId"] as const) {
    if (typeof options[key] !== "string") {
      throw new Error(`${name} is missing "${key}".`)
    }
  }
  return options
}
