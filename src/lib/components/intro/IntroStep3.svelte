<script lang="ts">
  import type { Player } from "$lib/player"
  import { onMount } from "svelte"
  import RoleHeader from "$lib/components/RoleHeader.svelte"

  export let player: Player | undefined

  let visibleSection = -1
  onMount(() => {
    setTimeout(() => {
      if (player?.role === "liberal") {
        setTimeout(() => (visibleSection = 0), 1000)
        setTimeout(() => (visibleSection = 1), 4000)
      } else {
        setTimeout(() => (visibleSection = 0), 1000)
        setTimeout(() => (visibleSection = 1), 3000)
      }
    }, 2000)
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
            class="rounded-md h-20 aspect-[397/555] bg-policy-fascist bg-contain bg-center -ml-4
                  z-{5 * 10 - policyIndex * 10}"
          />
        {/each}
      </div>
    </div>

    <div
      class="flex flex-col items-center gap-4 opacity-0 transition-opacity duration-1000"
      class:opacity-100={visibleSection >= 1}
    >
      <div class="relative w-full text-center">
        or if Hitler is elected Chancellor<br />(with three or more Fascist Policies on the board).
      </div>
      <div class="relative w-48 h-48">
        <div
          class="absolute inset-0 bg-player-hitler bg-contain bg-center rounded-full border-[6px] border-[#f7e1c1]"
        />
        <div
          class="absolute inset-x-0 bottom-0 aspect-[1321/349] bg-placard-chancellor bg-contain bg-center"
        />
        <div class="absolute bottom-10 right-0 flex">
          <div
            class="rounded-sm h-10 -rotate-12 aspect-[397/555] bg-policy-fascist bg-contain bg-center -ml-2 z-20"
          />
          <div
            class="rounded-sm h-10 -mt-0.5 aspect-[397/555] bg-policy-fascist bg-contain bg-center -ml-2 z-10"
          />
          <div
            class="rounded-sm h-10 rotate-12 aspect-[397/555] bg-policy-fascist bg-contain bg-center -ml-2"
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
            class="rounded-md h-20 aspect-[397/555] bg-policy-liberal bg-contain bg-center -ml-4
                  z-{5 * 10 - policyIndex * 10}"
          />
        {/each}
      </div>
    </div>

    <div
      class="flex flex-col items-center gap-4 opacity-0 transition-opacity duration-1000"
      class:opacity-100={visibleSection >= 1}
    >
      <div class="relative w-full text-center">
        or if {player?.role === "hitler" ? "you are" : "Hitler is"} killed.
      </div>
      <div class="relative w-48 h-48">
        <div
          class="absolute inset-0 bg-player-hitler bg-contain bg-center rounded-full border-[6px] border-[#f7e1c1]"
        />
        <div class="absolute inset-0 bg-hand-drawn-x bg-contain bg-center opacity-80" />
      </div>
    </div>
  {/if}
</div>
