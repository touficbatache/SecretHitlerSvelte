<script lang="ts">
  import { onMount } from "svelte"

  import type { GameDataPlayers } from "$lib/game_data"
  import type { Player } from "$lib/player"

  export let player: Player | undefined
  export let players: GameDataPlayers | undefined

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
        await new Promise((f) => setTimeout(f, 3000))
        visibleSection = 2
      }
    }, 1000)
  })
</script>

<div
  class="w-full h-full flex flex-col md:flex-row justify-around md:justify-evenly items-center px-6 md:p-0"
>
  {#if player?.role === "liberal"}
    <div
      class="flex flex-col gap-2 opacity-0 transition-opacity duration-1000"
      class:opacity-100={visibleSection >= 0}
    >
      <div class="relative w-full text-center">To win, enact 5 liberal policies</div>
      <div class="flex">
        {#each Array(5) as _, policyIndex}
          <!--          shadow-[0px_0px_8px_4px_#0000008a]-->
          <div
            class="rounded-md h-24 aspect-[7/10] bg-policy-liberal bg-contain bg-center -ml-5
                  z-{4 * 10 - policyIndex * 10} shadow-card-small"
          />
        {/each}
      </div>
    </div>

    <div
      class="flex flex-col items-center gap-4 opacity-0 transition-opacity duration-1000"
      class:opacity-100={visibleSection >= 1}
    >
      <div class="relative w-full text-center">Or kill the Secret Hitler</div>
      <div class="relative w-48 h-48">
        <div
          class="absolute inset-0 bg-player-hitler bg-contain bg-center rounded-full border-[6px] border-sh-beige"
        />
        <div class="absolute inset-0 bg-hand-drawn-x bg-contain bg-center opacity-80" />
      </div>
    </div>
  {:else}
    <div
      class="flex flex-col items-center gap-4 opacity-0 transition-opacity duration-1000"
      class:opacity-100={visibleSection >= 0}
    >
      <div class="relative w-full text-center">
        {#if player?.role === "fascist"}
          Hitler plays for your team
        {:else}
          You play for the fascist team
        {/if}
      </div>
      <div class="flex">
        {#each (players?.fascists ?? []).sort( (a) => (a?.role === "hitler" ? -1 : a?.self ? -1 : 0), ) as fascist, index}
          <div
            class="flex flex-col items-center z-{(players?.fascists?.length ?? 0) * 10 -
              index * 10} -ml-5"
          >
            <div class:invisible={index % 2 === 1}>
              {#if player.id === fascist.id || player?.role !== "hitler" || players?.all?.length < 7}
                <span>{fascist?.name}</span>
              {:else}
                <div class="bg-red-fascist w-12 h-3 mb-2 blur-xxs" />
              {/if}
            </div>
            <div
              class="w-20 md:w-28 h-20 md:h-28 bg-contain bg-center rounded-full border-4 border-sh-beige"
              class:bg-player-fascist-frog={fascist?.assetReference === "fascist_frog"}
              class:bg-player-fascist-lizard={fascist?.assetReference === "fascist_lizard"}
              class:bg-player-fascist-snake={fascist?.assetReference === "fascist_snake"}
              class:bg-player-hitler={fascist?.assetReference === "hitler"}
            />
            <div class:invisible={index % 2 === 0}>
              {#if player.id === fascist.id || player?.role !== "hitler" || players?.all?.length < 7}
                <span>{fascist?.name}</span>
              {:else}
                <div class="bg-red-fascist w-12 h-3 mt-2 blur-xxs" />
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>

    <div
      class="flex md:hidden flex-col gap-2 opacity-0 transition-opacity duration-1000"
      class:opacity-100={visibleSection >= 1}
    >
      <div class="relative w-full text-center">To win, enact 6 fascist policies</div>
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
      class="flex md:hidden flex-col items-center gap-4 opacity-0 transition-opacity duration-1000"
      class:opacity-100={visibleSection >= 2}
    >
      <div class="relative w-full text-center">
        {#if player?.role === "fascist"}
          Or elect Hitler as Chancellor<br />after 3+ Fascist policies are on the board
        {:else}
          Or be elected as Chancellor<br />after 3+ Fascist policies are on the board
        {/if}
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

    <div class="hidden md:flex h-full flex-col justify-around items-center">
      <div
        class="flex flex-col gap-2 opacity-0 transition-opacity duration-1000"
        class:opacity-100={visibleSection >= 1}
      >
        <div class="relative w-full text-center">To win, enact 6 fascist policies</div>
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
        class:opacity-100={visibleSection >= 2}
      >
        <div class="relative w-full text-center">
          {#if player?.role === "fascist"}
            Or elect Hitler as Chancellor<br />after 3+ Fascist policies are on the board
          {:else}
            Or be elected as Chancellor<br />after 3+ Fascist policies are on the board
          {/if}
        </div>
        <div class="relative w-36 h-36">
          <div
            class="absolute inset-0 bg-player-hitler bg-contain bg-center rounded-full border-[6px] border-sh-beige"
          />
          <div
            class="absolute inset-x-0 bottom-0 aspect-[1321/349] bg-placard-chancellor bg-contain bg-center"
          />
          <div class="absolute bottom-8 right-0 flex">
            <div
              class="rounded-sm h-8 -rotate-12 aspect-[7/10] bg-policy-fascist bg-contain bg-center -ml-2 z-20 shadow-md"
            />
            <div
              class="rounded-sm h-8 -mt-0.5 aspect-[7/10] bg-policy-fascist bg-contain bg-center -ml-2 z-10 shadow-md"
            />
            <div
              class="rounded-sm h-8 rotate-12 aspect-[7/10] bg-policy-fascist bg-contain bg-center -ml-2 shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
