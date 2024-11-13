<script lang="ts">
  import { getContext, onDestroy, onMount } from "svelte"
  import { quartOut } from "svelte/easing"
  import type { Writable } from "svelte/store"
  import { fade } from "svelte/transition"

  import * as ApiClient from "$lib/api_client"
  import FloatingWindow from "$lib/components/FloatingWindow.svelte"
  import PaperBack from "$lib/components/PaperBack.svelte"
  import PinInput from "$lib/components/PinInput.svelte"
  import Players from "$lib/components/Players.svelte"
  import PlayerView from "$lib/components/PlayerView.svelte"
  import type { GameData } from "$lib/game_data"
  import { mounted } from "$lib/mounted"

  export let gameCode: string
  export let gameData: GameData | undefined

  const contentOverflow: Writable<boolean> = getContext("contentOverflow") as Writable<boolean>
  const contentShiftRight: Writable<boolean> = getContext("contentShiftRight") as Writable<boolean>

  let innerWidth: number
  let infoOpen: boolean = false

  onMount(() => {
    $contentShiftRight = true
    $contentOverflow = true
  })
  onDestroy(() => {
    $contentShiftRight = false
    $contentOverflow = false
  })
</script>

<svelte:window bind:innerWidth />

{#if $mounted && gameData?.players}
  {#if innerWidth >= 768}
    <div
      class="absolute left-0 inset-y-16 w-[19rem] flex flex-col justify-between ml-16 mr-4 p-7 frame bg-[#141414]"
      transition:fade={{ duration: 500, easing: quartOut }}
    >
      <Players
        cols={3}
        players={gameData?.players?.others}
        showRoles={gameData?.players?.visibleRolePlayerIds()}
      />

      <div class="grid items-center grid-cols-3 gap-7">
        <button
          class="w-fit h-fit justify-self-start flex p-3 rounded-full hover:bg-white hover:bg-opacity-10 active:bg-white active:bg-opacity-20 transition-all duration-100 ease-material-standard"
          on:click={() => (infoOpen = !infoOpen)}
        >
          <iconify-icon class="text-2xl" icon="material-symbols:info-outline" />
        </button>

        <PlayerView player={gameData?.players?.self} showRole={true} revealCards={true} />

        <button
          class="w-fit h-fit justify-self-end flex p-3 rounded-full hover:bg-white hover:bg-opacity-10 active:bg-white active:bg-opacity-20 transition-all duration-100 ease-material-standard"
          on:click={ApiClient.leaveGame}
        >
          <iconify-icon class="text-2xl" icon="material-symbols:logout" />
        </button>
      </div>
    </div>
  {/if}

  <div
    class="relative w-full h-full flex flex-col justify-between md:justify-center"
    transition:fade={{ delay: 500, duration: 500, easing: quartOut }}
  >
    <div class="absolute inset-x-6 top-4 block md:hidden">
      <Players
        cols={5}
        players={gameData?.players?.others}
        showRoles={gameData?.players?.visibleRolePlayerIds()}
      />
    </div>

    <slot />

    <PaperBack
      classes="!absolute inset-x-6 bottom-4 block md:hidden"
      contentClasses="flex justify-center gap-6 px-10 py-2"
      backgroundColor={gameData?.players.self.role === "liberal" ? "#0091b3" : "#d60d00"}
    >
      <div class="w-full flex justify-between">
        <button
          class="w-fit h-fit flex p-3 rounded-full hover:bg-white hover:bg-opacity-10 active:bg-white active:bg-opacity-20 transition-all duration-100 ease-material-standard"
          on:click={() => (infoOpen = !infoOpen)}
        >
          <iconify-icon class="text-2xl" icon="material-symbols:info-outline" />
        </button>

        <!--        <PlayfulIconButton-->
        <!--          extraClasses="w-10 h-10"-->
        <!--          icon="fa:info"-->
        <!--          on:click={() => (showInfo = !showInfo)}-->
        <!--        />-->

        <div class="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/5 z-50">
          <PlayerView revealCards={true} player={gameData?.players?.self} showRole={true} />
        </div>

        <button
          class="w-fit h-fit flex p-3 rounded-full hover:bg-white hover:bg-opacity-10 active:bg-white active:bg-opacity-20 transition-all duration-100 ease-material-standard"
          on:click={ApiClient.leaveGame}
        >
          <iconify-icon class="text-2xl" icon="material-symbols:logout" />
        </button>
      </div>
    </PaperBack>

    <FloatingWindow
      classes="py-6 flex flex-col bg-[#424242] shadow-2xl rounded-lg"
      bind:open={infoOpen}
    >
      <span class="w-full text-center">Game info</span>

      <div class="flex flex-col gap-8 mt-4 px-6">
        <PinInput
          isEnabled={false}
          inactiveClass="bg-button-500 text-sh-yellow-500"
          activeClass="bg-sh-yellow-500 bg-opacity-70 text-sh-yellow-500 border-2 border-sh-yellow-500 border-opacity-70"
          pin={gameCode}
        />

        <div class="flex flex-col gap-2">
          <span>
            {gameData?.players?.fascists.length} fascists
          </span>
          <Players
            players={gameData?.players?.fascists.sort(() => Math.random() - 0.5)}
            hideExtras={true}
            hideName={true}
            hidePlacards={true}
            hideVotes={true}
            showRoles={!gameData?.settings.hidePicsGameInfo
              ? gameData?.players?.all.map((player) => player.id)
              : []}
          />
        </div>

        <div class="flex flex-col gap-2">
          <span>
            {gameData?.players?.liberals.length} liberals
          </span>
          <Players
            players={gameData?.players?.liberals.sort(() => Math.random() - 0.5)}
            hideExtras={true}
            hideName={true}
            hidePlacards={true}
            hideVotes={true}
            showRoles={!gameData?.settings.hidePicsGameInfo
              ? gameData?.players?.all.map((player) => player.id)
              : []}
          />
        </div>
      </div>
    </FloatingWindow>
  </div>
{/if}
