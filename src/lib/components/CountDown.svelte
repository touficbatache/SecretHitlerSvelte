<script lang="ts">
  import { fly } from "svelte/transition"

  export let classContainer: string = "relative"
  export let classNumber: string = "absolute inset-0 text-2xl"
  export let from: number = 4
  export let interval: number = 1000
  export let startDelay: number = 2000
  export let trigger: boolean = false

  let countDown: number = from
  let countDownHasStarted: boolean = false
  let countDownIsTriggered: boolean = false

  $: if (trigger === true) {
    countDownIsTriggered = true
  }

  $: if (countDownIsTriggered === true) {
    startCountdown()
  }

  function startCountdown() {
    if (countDownHasStarted) {
      return
    }

    countDownHasStarted = true

    setTimeout(async () => {
      while (countDown > 0) {
        countDown--
        await new Promise((f) => setTimeout(f, interval))
      }
      if (countDown === 0) {
        resetCountdown()
      }
    }, startDelay)
  }

  function resetCountdown() {
    if (!countDownHasStarted) {
      return
    }

    countDown = from
    countDownIsTriggered = false
    countDownHasStarted = false
  }
</script>

<div class={classContainer}>
  {#key countDown}
    <span
      class={classNumber}
      in:fly={{ duration: 700, y: "30px" }}
      out:fly={{ duration: 200, y: "-30px" }}
    >
      {from > countDown && countDown > 0 ? countDown : ""}
    </span>
  {/key}
</div>
