import {
  type Database,
  type DatabaseReference,
  onDisconnect,
  onValue,
  ref as dbRef,
  set,
  type Unsubscribe,
} from "firebase/database"

/**
 * Marks the player as connected to the game for as long as this tab is connected to the
 * database, including after a dropped connection comes back.
 *
 * @returns a function that stops tracking and marks the player as disconnected.
 */
export function trackPresence(rtdb: Database, gameCode: string, userId: string): () => void {
  const connectedRef: DatabaseReference = dbRef(
    rtdb,
    `ongoingGames/${gameCode}/connected/${userId}`,
  )

  const unsubscribe: Unsubscribe = onValue(dbRef(rtdb, ".info/connected"), (snapshot) => {
    if (snapshot.val() === true) {
      // Register the disconnect handler first, so a connection lost right after is still caught
      onDisconnect(connectedRef)
        .set(false)
        .then(() => set(connectedRef, true))
        .catch(logPresenceError)
    }
  })

  return () => {
    unsubscribe()
    onDisconnect(connectedRef).cancel().catch(logPresenceError)
    set(connectedRef, false).catch(logPresenceError)
  }
}

function logPresenceError(error: unknown) {
  // Expected when the player is no longer in the game: the rules then reject the write.
  console.debug("Presence not updated:", error)
}
