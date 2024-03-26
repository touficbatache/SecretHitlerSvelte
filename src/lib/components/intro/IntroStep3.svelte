<script lang="ts">
  import { onMount } from "svelte"

  import type { Player } from "$lib/player"

  export let player: Player | undefined

  let visibleSection: number = -1
  onMount(() => {
    setTimeout(async () => {
      if (player?.role === "liberal") {
        visibleSection = 0
        await new Promise((f) => setTimeout(f, 4000))
        visibleSection = 1
      } else {
        visibleSection = 0
        await new Promise((f) => setTimeout(f, 3000))
        visibleSection = 1
      }
    }, 1000)
  })
</script>

<div class="w-full h-full flex flex-col justify-evenly items-center px-6 md:p-0">
  {#if player?.role === "liberal"}
    <div
      class="flex flex-col items-center gap-2 opacity-0 transition-opacity duration-1000"
      class:opacity-100={visibleSection >= 0}
    >
      <div class="relative w-full text-center">You lose if 6 fascist policies are enacted</div>
      <div class="flex">
        {#each Array(6) as _, policyIndex}
          <div
            class="rounded-md h-20 aspect-[7/10] bg-policy-fascist bg-contain bg-center -ml-4
                  z-{5 * 10 - policyIndex * 10} shadow-card-small"
          />
        {/each}
      </div>
    </div>

    <div
      class="flex flex-col items-center gap-4 opacity-0 transition-opacity duration-1000"
      class:opacity-100={visibleSection >= 1}
    >
      <div class="relative w-full text-center">
        Or if Hitler is elected Chancellor<br />(with 3+ Fascist policies on the board)
      </div>
      <div class="relative w-48 h-48">
        <div
          class="absolute inset-0 bg-player-hitler bg-contain bg-center rounded-full border-[6px] border-sh-beige"
        />
        <div
          class="absolute inset-x-0 bottom-0 aspect-[1321/349] bg-placard-chancellor bg-contain bg-center"
        />
        <div class="absolute bottom-10 right-0 flex">
          <div
            class="rounded-sm h-10 -rotate-12 aspect-[7/10] bg-policy-fascist bg-contain bg-center -ml-2 z-20 shadow-md"
          />
          <div
            class="rounded-sm h-10 -mt-0.5 aspect-[7/10] bg-policy-fascist bg-contain bg-center -ml-2 z-10 shadow-md"
          />
          <div
            class="rounded-sm h-10 rotate-12 aspect-[7/10] bg-policy-fascist bg-contain bg-center -ml-2 shadow-md"
          />
        </div>
      </div>
    </div>
  {:else}
    <div
      class="flex flex-col items-center gap-2 opacity-0 transition-opacity duration-1000"
      class:opacity-100={visibleSection >= 0}
    >
      <div class="relative w-full text-center">You lose if 5 liberal policies are enacted</div>
      <div class="flex">
        {#each Array(5) as _, policyIndex}
          <div
            class="rounded-md h-20 aspect-[7/10] bg-policy-liberal bg-contain bg-center -ml-4
                  z-{5 * 10 - policyIndex * 10} shadow-card-small"
          />
        {/each}
      </div>
    </div>

    <div
      class="flex flex-col items-center gap-4 opacity-0 transition-opacity duration-1000"
      class:opacity-100={visibleSection >= 1}
    >
      <div class="relative w-full text-center">
        Or if {player?.role === "hitler" ? "you are" : "Hitler is"} killed
      </div>
      <div class="relative w-48 h-48">
        <div
          class="absolute inset-0 bg-player-hitler bg-contain bg-center rounded-full border-[6px] border-sh-beige"
        />
        <div class="absolute inset-0 bg-hand-drawn-x bg-contain bg-center opacity-80" />
      </div>
    </div>
  {/if}
</div>
