import { type FirebaseApp, type FirebaseOptions, initializeApp } from "firebase/app"
import {
  getAuth,
  onIdTokenChanged,
  signOut as _signOut,
  type Auth,
  updateProfile,
} from "firebase/auth"

import { browser } from "$app/environment"
import { invalidateAll } from "$app/navigation"
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check"

// Initialize Firebase
export let app: FirebaseApp

export function initializeFirebase(firebaseConfig: FirebaseOptions, devMode: boolean): void {
  if (!browser) {
    throw new Error("Can't use the Firebase client on the server.")
  }

  if (!app) {
    app = initializeApp(firebaseConfig)
    if (devMode) {
      self.FIREBASE_APPCHECK_DEBUG_TOKEN = true
    }
    initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider("6LfGHDUoAAAAAFX-EBTpFEbo-v7n08QGyQPPk5yo"),
      isTokenAutoRefreshEnabled: true,
    })
    listenForAuthChanges()
  }
}

function listenForAuthChanges() {
  const auth: Auth = getAuth(app)

  // In addition to sign-in and sign-out, this observer will
  // fire if a token has expired (> 1 hour), generating a new one
  onIdTokenChanged(
    auth,
    async (user) => {
      if (user) {
        const token = await user.getIdToken()
        await setTokenCookie(token)
      } else {
        await setTokenCookie(undefined)
      }
    },
    (err) => console.error(err.message),
  )
}

async function setTokenCookie(token: string | undefined) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({ token }),
  }

  await fetch("/api/login", options)

  await invalidateAll()
}

export function setUserName(name: string) {
  const currentUser = getAuth(app).currentUser
  if (currentUser !== null) {
    updateProfile(currentUser, {
      displayName: name,
    })
      .then(async () => {
        const token = await getAuth(app).currentUser?.getIdToken()
        await setTokenCookie(token)
      })
      .catch((reason) => {
        console.error(reason)
      })
  } else {
    console.error("Current user cannot be found")
  }
}

export async function signOut() {
  const auth: Auth = getAuth(app)
  await _signOut(auth)
}
