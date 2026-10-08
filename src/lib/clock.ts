import { type Database, onValue, ref as dbRef } from "firebase/database"

let offsetMs: number = 0
let isTracking: boolean = false

/**
 * Keeps the difference between this device's clock and the database server's up to date. Phases
 * end at server times (see GameData.pendingTransition), and players' clocks can be off by
 * seconds, so every countdown and deadline uses serverNow().
 */
export function trackServerClock(rtdb: Database): void {
  if (isTracking) return
  isTracking = true
  onValue(dbRef(rtdb, ".info/serverTimeOffset"), (snapshot) => {
    offsetMs = snapshot.val() ?? 0
  })
}

/** The current time on the server's clock, in milliseconds. */
export function serverNow(): number {
  return Date.now() + offsetMs
}
