// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      debugMode: boolean
      firebaseAppConfig: import("@firebase/app").FirebaseOptions
      gameCode?: string
      recaptchaSiteKey: string
      streamerModeEnabled?: boolean
      user?: import("$lib/user").User
    }
    // interface PageData {}
    // interface Platform {}
  }
}

export {}
