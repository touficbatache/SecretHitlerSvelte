// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      devMode: boolean
      firebaseAppConfig: import("@firebase/app").FirebaseOptions
      gameCode?: string
      recaptchaSiteKey: string
      user?: import("$lib/user").User
    }
    // interface PageData {}
    // interface Platform {}
  }
}

export {}
