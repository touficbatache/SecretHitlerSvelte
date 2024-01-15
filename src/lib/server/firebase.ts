import { FIREBASE_SERVER_CONFIG } from "$env/static/private"
import { PUBLIC_FIREBASE_CONFIG } from "$env/static/public"

import admin from "firebase-admin"
import type { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier"

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

export interface TokenResponse extends DecodedIdToken {
  name: string | undefined
}

function initializeFirebase() {
  if (!admin.apps.length) {
    const publicConfig = JSON.parse(PUBLIC_FIREBASE_CONFIG)
    const serviceAccount = JSON.parse(FIREBASE_SERVER_CONFIG)
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: publicConfig.databaseURL,
    })
  }
}

export async function verifyToken(token: string): Promise<TokenResponse> {
  if (token === undefined) {
    throw new Error("Invalid login.")
  }

  initializeFirebase()

  const decodedToken = await admin.auth().verifyIdToken(token)

  if (!decodedToken) {
    throw new Error("Couldn't decode login.")
  }

  const user = await admin.auth().getUser(decodedToken.uid)

  return {
    ...decodedToken,
    name: user.displayName,
  }
}
