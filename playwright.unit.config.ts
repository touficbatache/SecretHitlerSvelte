import { defineConfig } from "@playwright/test"

/** Unit tests: plain TypeScript next to the code they test, no browser and no emulators. */
export default defineConfig({
  testDir: "src",
  testMatch: "**/*.test.ts",
})
