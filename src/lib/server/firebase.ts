import admin from "firebase-admin"
import type { UserRecord } from "firebase-admin/auth"

import { PRIVATE_FIREBASE_SERVER_CONFIG } from "$env/static/private"
import { PUBLIC_DEBUG, PUBLIC_FIREBASE_CONFIG } from "$env/static/public"

export interface FirebaseServerConfig {
  type: string
  project_id: string
  private_key_id: string
  private_key: string
  client_email: string
  client_id: number
  auth_uri: string
  token_uri: string
  auth_provider_x509_cert_url: string
  client_x509_cert_url: string
  universe_domain: string
}

// Correct way of doing is using  `if (!admin.apps.length)` but
// Firebase goes crazy when deploying with functions, so:
const initialized = admin.apps.some((app) => app.name === "[DEFAULT]")

if (!initialized) {
  const publicConfig = JSON.parse(PUBLIC_FIREBASE_CONFIG)
  const serviceAccount = JSON.parse(PRIVATE_FIREBASE_SERVER_CONFIG)
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: publicConfig.databaseURL,
  })
} else if (PUBLIC_DEBUG) {
  console.log("admin", admin)
  console.log("admin.apps", admin.apps)
  console.log("admin.apps.length", admin.apps.length)
}

export async function verifyGameCode(gameCode?: string): Promise<string> {
  if (gameCode === undefined) {
    throw new Error("Invalid game code.")
  }

  const snapshot = await admin.database().ref(`ongoingGames/${gameCode}`).get()

  if (!snapshot.exists()) {
    throw new Error("Invalid game code.")
  }

  return gameCode
}

export async function verifyIdToken(token?: string): Promise<UserRecord> {
  if (token === undefined) {
    throw new Error("Invalid login.")
  }

  const decodedToken = await admin.auth().verifyIdToken(token)

  if (!decodedToken) {
    throw new Error("Couldn't decode login.")
  }

  const user: UserRecord = await admin.auth().getUser(decodedToken.uid)

  if (!user) {
    throw new Error("Couldn't find user.")
  }

  return user
}
