<script lang="ts">
  import { onMount } from "svelte"
  import { fade } from "svelte/transition"

  import type { Player } from "$lib/player"
  import type { GameDataPlayers } from "$lib/game_data"
  import PaperBack from "$lib/components/PaperBack.svelte"

  export let player: Player | undefined
  export let players: GameDataPlayers | undefined

  // const players = {
  //   fascists: [
  //     { assetReference: "fascist_lizard" },
  //     { assetReference: "fascist_snake" },
  //     { self: true, assetReference: "fascist_frog" },
  //     { role: "hitler", assetReference: "hitler" },
  //   ],
  // }

  let visibleSection = -1
  onMount(() => {
    setTimeout(() => {
      if (player?.role === "liberal") {
        setTimeout(() => (visibleSection = 0), 1000)
        setTimeout(() => (visibleSection = 1), 3000)
      } else {
        setTimeout(() => (visibleSection = 0), 1000)
        setTimeout(() => (visibleSection = 1), 4000)
        setTimeout(() => (visibleSection = 2), 8000)
      }
    }, 2000)
  })
</script>

<PaperBack
  classes="!absolute inset-x-0 mx-2"
  contentClasses="flex justify-center gap-6 px-10 py-2"
  backgroundColor={player?.role === "liberal" ? "#0091b3" : "#d60d00"}
>
  <div class="flex">
    <div
      class="z-10 rounded-sm h-10 aspect-[397/555] bg-contain bg-center -rotate-[15deg]"
      class:bg-card-role-fascist-frog={player?.assetReference === "fascist_frog"}
      class:bg-card-role-fascist-lizard={player?.assetReference === "fascist_lizard"}
      class:bg-card-role-fascist-snake={player?.assetReference === "fascist_snake"}
      class:bg-card-role-hitler={player?.assetReference === "hitler"}
      class:bg-card-role-liberal-1={player?.assetReference === "liberal_1"}
      class:bg-card-role-liberal-2={player?.assetReference === "liberal_2"}
      class:bg-card-role-liberal-3={player?.assetReference === "liberal_3"}
      class:bg-card-role-liberal-4={player?.assetReference === "liberal_4"}
      class:bg-card-role-liberal-5={player?.assetReference === "liberal_5"}
      class:bg-card-role-liberal-6={player?.assetReference === "liberal_6"}
    />
    <div
      class="rounded-sm h-10 aspect-[397/555] bg-contain bg-center rotate-[15deg] -ml-3"
      class:bg-card-membership-liberal={player?.membership === "liberal"}
      class:bg-card-membership-fascist={player?.membership === "fascist"}
    />
  </div>
  <div class="flex flex-col">
    <h3 class="font-eskapade_fraktur text-4xl uppercase">{player?.role}</h3>
  </div>
</PaperBack>

<div class="w-full h-full flex flex-col justify-evenly items-center px-6 md:p-0">
  {#if player?.role === "liberal"}
    <div
      class="flex flex-col gap-2 opacity-0 transition-opacity duration-1000"
      class:opacity-100={visibleSection >= 0}
    >
      <div class="relative w-full text-center">Enact 5 liberal policies</div>
      <div class="flex">
        {#each Array(5) as _, policyIndex}
          <div
            class="rounded-md h-24 aspect-[397/555] bg-policy-liberal bg-contain bg-center -ml-2
                  z-{4 * 10 - policyIndex * 10}"
          />
        {/each}
      </div>
    </div>

    <div
      class="flex flex-col items-center gap-4 opacity-0 transition-opacity duration-1000"
      class:opacity-100={visibleSection >= 1}
    >
      <div class="relative w-full text-center">or kill the Secret Hitler.</div>
      <div class="relative w-48 h-48">
        <div
          class="absolute inset-0 bg-player-hitler bg-contain bg-center rounded-full border-[6px] border-[#f7e1c1]"
        />
        <div class="absolute inset-0 bg-hand-drawn-x bg-contain bg-center opacity-80" />
      </div>
      <!--      <div class="relative aspect-[397/555] h-48">-->
      <!--        <div class="absolute inset-0 bg-card-role-hitler bg-contain bg-center rounded-md" />-->
      <!--        <div-->
      <!--          class="absolute inset-0 bg-hand-drawn-x bg-contain bg-center bg-no-repeat opacity-80"-->
      <!--        />-->
      <!--      </div>-->
    </div>
  {:else}
    <div
      class="flex flex-col items-center gap-4 opacity-0 transition-opacity duration-1000"
      class:opacity-100={visibleSection >= 0}
    >
      <div class="relative w-full text-center">
        {#if player?.role === "fascist"}
          Hitler plays for your team.
        {:else}
          You play for the fascist team.
        {/if}
      </div>
      <div class="flex">
        {#each (players?.fascists ?? []).sort( (a) => (a?.role === "hitler" ? -1 : a?.self ? -1 : 0), ) as fascist, index}
          <div
            class="flex flex-col items-center z-{(players?.fascists?.length ?? 0) * 10 -
              index * 10} -ml-5"
          >
            <span class:invisible={index % 2 === 1}>{fascist?.name}</span>
            <div
              class="w-24 h-24 bg-contain bg-center rounded-full border-4 border-[#f7e1c1]"
              class:bg-player-fascist-frog={fascist?.assetReference === "fascist_frog"}
              class:bg-player-fascist-lizard={fascist?.assetReference === "fascist_lizard"}
              class:bg-player-fascist-snake={fascist?.assetReference === "fascist_snake"}
              class:bg-player-hitler={fascist?.assetReference === "hitler"}
            />
            <span class:invisible={index % 2 === 0}>{fascist?.name}</span>
          </div>
        {/each}
      </div>
    </div>

    <div
      class="flex flex-col gap-2 opacity-0 transition-opacity duration-1000"
      class:opacity-100={visibleSection >= 1}
    >
      <div class="relative w-full text-center">Enact 6 fascist policies</div>
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
      class:opacity-100={visibleSection >= 2}
    >
      <div class="relative w-full text-center">
        {#if player?.role === "fascist"}
          or elect Hitler as Chancellor<br />(with three or more Fascist Policies on the board).
        {:else}
          or be elected as Chancellor<br />(with three or more Fascist Policies on the board).
        {/if}
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
  {/if}
</div>
