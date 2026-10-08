import admin from "firebase-admin"
import type { DecodedIdToken, UserRecord } from "firebase-admin/auth"
import type { DataSnapshot } from "firebase-admin/database"

import config from "$lib/server/config"

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
const initialized: boolean = admin.apps.some((app) => app?.name === "[DEFAULT]")

if (!initialized) {
  const serviceAccount: FirebaseServerConfig = config.firebaseServerConfig
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key,
    }),
    databaseURL: config.firebaseAppConfig.databaseURL,
  })
} else if (config.debugMode) {
  console.log("admin", admin)
  console.log("admin.apps", admin.apps)
  console.log("admin.apps.length", admin.apps.length)
}

export async function verifyGameCode(gameCode?: string): Promise<string> {
  if (gameCode === undefined) {
    throw new Error("Invalid game code.")
  }

  const snapshot: DataSnapshot = await admin.database().ref(`ongoingGames/${gameCode}`).get()

  if (!snapshot.exists()) {
    throw new Error("Invalid game code.")
  }

  return gameCode
}

export async function verifyIdToken(token?: string): Promise<UserRecord> {
  if (token === undefined) {
    throw new Error("Invalid login.")
  }

  const decodedToken: DecodedIdToken = await admin.auth().verifyIdToken(token)

  if (!decodedToken) {
    throw new Error("Couldn't decode login.")
  }

  const user: UserRecord = await admin.auth().getUser(decodedToken.uid)

  if (!user) {
    throw new Error("Couldn't find user.")
  }

  return user
}
