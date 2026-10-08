import { generateKeyPairSync } from "node:crypto"

import { defineConfig } from "@playwright/test"

import { FAKE_API_PORT } from "./tests/e2e/helpers"

/*
 * End-to-end tests: the app runs against the Firebase auth and database emulators, and a fake
 * game API. Run them with `npm run test:e2e`, which starts the emulators.
 */

const APP_PORT: number = 5180

// firebase-admin needs a well-formed service account, even though the emulators ignore it
const { privateKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
  publicKeyEncoding: { type: "spki", format: "pem" },
})

const serviceAccount: Record<string, string | number> = {
  type: "service_account",
  project_id: "demo-shtest",
  private_key_id: "e2e",
  private_key: privateKey,
  client_email: "e2e@demo-shtest.iam.gserviceaccount.com",
  client_id: 1,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/e2e",
  universe_domain: "googleapis.com",
}

const firebaseAppConfig: Record<string, string> = {
  apiKey: "demo-key",
  authDomain: "demo-shtest.firebaseapp.com",
  databaseURL: "https://demo-shtest-default-rtdb.firebaseio.com",
  projectId: "demo-shtest",
  storageBucket: "demo-shtest.appspot.com",
  messagingSenderId: "1",
  appId: "1:1:web:1",
}

export default defineConfig({
  testDir: "tests/e2e",
  // The tests share the emulators and the fake API, so they run one at a time
  workers: 1,
  fullyParallel: false,
  timeout: 90_000,
  globalSetup: "./tests/e2e/global-setup.ts",
  use: {
    baseURL: `http://127.0.0.1:${APP_PORT}`,
    viewport: { width: 1280, height: 800 },
  },
  // The app listens on 127.0.0.1, where the tests reach it. With "localhost", Vite listens on
  // whichever address that resolves to first: ::1 on GitHub's runners, so the tests never reach it.
  webServer: [
    {
      command: `vite dev --host 127.0.0.1 --port ${APP_PORT} --strictPort`,
      url: `http://127.0.0.1:${APP_PORT}/login`,
      timeout: 120_000,
      env: {
        FIREBASE_AUTH_EMULATOR_HOST: "127.0.0.1:9099",
        FIREBASE_DATABASE_EMULATOR_HOST: "127.0.0.1:9000",
        PUBLIC_API_URL: `http://localhost:${FAKE_API_PORT}/`,
        PUBLIC_DEBUG: "false",
        PUBLIC_FIREBASE_CONFIG: JSON.stringify(firebaseAppConfig),
        PUBLIC_RECAPTCHA_SITE_KEY: "unused-with-emulators",
        PUBLIC_SECURE: "false",
        PUBLIC_USE_EMULATORS: "true",
        PRIVATE_FIREBASE_SERVER_CONFIG: JSON.stringify(serviceAccount),
      },
    },
  ],
})
