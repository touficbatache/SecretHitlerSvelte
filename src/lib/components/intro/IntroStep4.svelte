<script lang="ts">
  import { onMount } from "svelte"
  import { fly } from "svelte/transition"

  let countDown = 4
  onMount(() => {
    setTimeout(async () => {
      while (countDown > 0) {
        countDown--
        await new Promise((f) => setTimeout(f, 1000))
      }
    }, 1000)
  })
</script>

{#key countDown}
  <span
    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl"
    in:fly={{ duration: 700, y: "30px" }}
    out:fly={{ duration: 200, y: "-30px" }}
  >
    {4 > countDown && countDown > 0 ? countDown : ""}
  </span>
{/key}
