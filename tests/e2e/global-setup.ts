import { startFakeApi } from "./fake-api"
import { ALICE, BOB, createUsers, db, FAKE_API_PORT, PROJECT_ID } from "./helpers"

/**
 * Starts every run from empty emulators, with the two test players signed up, and starts the
 * fake game API. Returns the teardown, which stops the fake API.
 */
export default async function globalSetup(): Promise<() => Promise<void>> {
  try {
    await fetch(`http://127.0.0.1:9099/emulator/v1/projects/${PROJECT_ID}/accounts`, {
      method: "DELETE",
    })
    await db("DELETE", "")
  } catch (error) {
    throw new Error(
      `The Firebase emulators aren't running. Use "npm run test:e2e", which starts them.\n${error}`,
    )
  }
  await createUsers([ALICE, BOB])
  return startFakeApi(FAKE_API_PORT)
}
