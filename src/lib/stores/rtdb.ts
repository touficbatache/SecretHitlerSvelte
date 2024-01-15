// https://sveltefire.fireship.io/

import { type Readable, readable, writable } from "svelte/store"
import { onValue, ref as dbRef } from "firebase/database"
import type { Database } from "firebase/database"

/**
 * @param {Database} rtdb - Firebase Realtime Database instance.
 * @param {string} path - Path to the individual database node.
 * @param {function} cast - Casts the snapshot using the given function.
 * @returns a store with realtime updates on individual database nodes.
 */
export function nodeStore<T = any>(
  rtdb: Database,
  path: string,
  cast?: (snapshot: any) => T,
): Readable<T | undefined> {
  const dataRef = dbRef(rtdb, path)

  const store = readable<T | undefined>(undefined, (set) => {
    const unsubscribe = onValue(dataRef, (snapshot) => {
      if (cast === undefined) {
        set(snapshot.val() as T)
      } else {
        set(cast(snapshot.val()) as T)
      }
    })

    return unsubscribe
  })

  return store
}

/**
 * @param {Database} rtdb - Firebase Realtime Database instance.
 * @param {string} path - Path to the list of nodes.
 * @param {T[]} startWith - Optional default data.
 * @returns a store with realtime updates on lists of nodes.
 */
export function nodeListStore<T = any>(rtdb: Database, path: string, startWith: T[] = []) {
  const listRef = dbRef(rtdb, path)

  const { subscribe } = writable<T[]>(startWith, (set) => {
    const unsubscribe = onValue(listRef, (snapshot) => {
      const dataArr: T[] = []
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val()
        dataArr.push({
          nodeKey: childSnapshot.ref.key,
          ...(typeof childData === "object" ? childData : {}),
        } as T)
      })
      set(dataArr)
    })

    return unsubscribe
  })

  return {
    subscribe,
    ref: listRef,
  }
}
