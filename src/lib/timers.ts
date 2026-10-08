import { onDestroy } from "svelte"

export interface Timers {
  /** Like setTimeout, but cancelled when the component is destroyed. */
  setTimeout: (callback: () => void, ms: number) => void
  /** Resolves after `ms`, or never if the component is destroyed first. */
  sleep: (ms: number) => Promise<void>
  /** Whether the component is still mounted. Check it after awaiting anything slow. */
  readonly isAlive: () => boolean
}

/**
 * Timers owned by the calling component: all of them are cleared when it is destroyed, so a
 * callback never runs against a page the player already left.
 *
 * Must be called while the component initializes, like onDestroy.
 */
export function createTimers(): Timers {
  const ids: Set<ReturnType<typeof setTimeout>> = new Set()
  let alive: boolean = true

  onDestroy(() => {
    alive = false
    ids.forEach((id) => clearTimeout(id))
    ids.clear()
  })

  function schedule(callback: () => void, ms: number) {
    if (!alive) return
    const id: ReturnType<typeof setTimeout> = setTimeout(() => {
      ids.delete(id)
      callback()
    }, ms)
    ids.add(id)
  }

  return {
    setTimeout: schedule,
    sleep: (ms: number) => new Promise((resolve) => schedule(resolve, ms)),
    isAlive: () => alive,
  }
}
