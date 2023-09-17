import { type FirebaseApp, type FirebaseOptions, initializeApp } from "firebase/app"
import { getAuth, onIdTokenChanged, signOut as _signOut, type Auth } from "firebase/auth"

import { browser } from "$app/environment"
import { invalidateAll } from "$app/navigation"

// Initialize Firebase
export let app: FirebaseApp

export function initializeFirebase(config: FirebaseOptions): void {
  if (!browser) {
    throw new Error("Can't use the Firebase client on the server.")
  }

  if (!app) {
    app = initializeApp(config)
    listenForAuthChanges()
  }
}

function listenForAuthChanges() {
  const auth: Auth = getAuth(app)

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

export async function signOut() {
  const auth: Auth = getAuth(app)
  await _signOut(auth)
}
