import { defineConfig } from "@playwright/test"

import { FAKE_API_PORT } from "./tests/e2e/helpers"

/*
 * End-to-end tests: the app runs against the Firebase auth and database emulators, and a fake
 * game API. Run them with `npm run test:e2e`, which starts the emulators.
 */

const APP_PORT: number = 5180

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
        PUBLIC_API_URL: `http://localhost:${FAKE_API_PORT}/`,
        PUBLIC_DEBUG: "false",
        PUBLIC_FIREBASE_CONFIG: JSON.stringify(firebaseAppConfig),
        PUBLIC_RECAPTCHA_SITE_KEY: "unused-with-emulators",
        PUBLIC_USE_EMULATORS: "true",
      },
    },
  ],
})
