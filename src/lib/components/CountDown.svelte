<script lang="ts">
  import { onDestroy } from "svelte"
  import { fly } from "svelte/transition"

  import { serverNow } from "$lib/clock"

  export let classContainer: string = "relative"
  export let classNumber: string = "absolute inset-0 text-2xl"
  /** The first number shown: the count goes from, …, 2, 1. */
  export let from: number = 3
  /** When the count reaches 0, on the server's clock. Nothing shows while undefined. */
  export let until: number | undefined = undefined

  // Derived from the clock on every tick, so every player sees the same number at the same
  // time, including after a reload in the middle of the count
  let remaining: number | undefined = undefined
  let ticker: ReturnType<typeof setInterval> | undefined

  $: track(until)

  function track(until: number | undefined) {
    clearInterval(ticker)
    ticker = undefined
    update()
    if (until !== undefined) {
      ticker = setInterval(update, 100)
    }
  }

  function update() {
    const seconds: number | undefined =
      until !== undefined ? Math.ceil((until - serverNow()) / 1000) : undefined
    remaining = seconds !== undefined && seconds >= 1 && seconds <= from ? seconds : undefined
    if (until !== undefined && seconds !== undefined && seconds < 1) {
      clearInterval(ticker)
      ticker = undefined
    }
  }

  onDestroy(() => clearInterval(ticker))
</script>

<div class={classContainer} role="timer">
  {#key remaining}
    <span
      class={classNumber}
      in:fly={{ duration: 700, y: "30px" }}
      out:fly={{ duration: 200, y: "-30px" }}
    >
      {remaining ?? ""}
    </span>
  {/key}
</div>
