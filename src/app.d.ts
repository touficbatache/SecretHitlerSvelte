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

  interface Window {
    /** Turns on the App Check debug provider, see https://firebase.google.com/docs/app-check/web/debug-provider */
    FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean | string
    /** The login page's invisible reCAPTCHA, see https://firebase.google.com/docs/auth/web/phone-auth */
    recaptchaVerifier?: import("firebase/auth").RecaptchaVerifier
  }
}

export {}
