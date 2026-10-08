import { onMount } from "svelte"
import type { Readable } from "svelte/store"

export const mounted: Readable<boolean> = {
  subscribe(fn: (value: boolean) => void) {
    fn(false)
    onMount(() => fn(true))
    return () => {
      // Nothing to clean up: onMount is tied to the subscribing component
    }
  },
}
