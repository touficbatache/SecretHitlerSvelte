<script lang="ts">
  import { getContext } from "svelte"
  import type { Writable } from "svelte/store"

  import { browser } from "$app/environment"
  import { goto } from "$app/navigation"
  import { page } from "$app/stores"
  import * as ApiClient from "$lib/api_client"
  import { clickOutside } from "$lib/click_outside"
  import PinInput from "$lib/components/PinInput.svelte"
  import Players from "$lib/components/Players.svelte"
  import Settings from "$lib/components/Settings.svelte"
  import SHButton from "$lib/components/SHButton.svelte"
  import type { GameData } from "$lib/game_data"

  const gameCode = $page.data.gameCode
  const gameData = getContext("gameData") as Writable<GameData>

  // TODO: make it false again if error, and show error
  let isStarting = false

  let btnSettings: HTMLElement
  let hideAvatars = false
  let skipLongIntro = false
  let showSettings = false

  $: if (browser) {
    if ($page.data.gameCode === undefined) {
      goto("/")
    }

    if ($gameData?.status !== "waiting") {
      goto("/gameplay")
    }
  }

  async function start() {
    isStarting = true
    const response = await ApiClient.startGame(gameCode, hideAvatars, skipLongIntro)
    if (response.error) {
      isStarting = false
    }
  }
</script>

{#if $gameData?.status === "waiting"}
  <div class="w-full h-full px-6 flex flex-col justify-evenly items-center">
    <div class="w-full flex flex-col items-center gap-5">
      <span class="text-4xl">Game code</span>

      <PinInput
        isEnabled={false}
        inactiveClass="bg-button-500 text-sh-yellow-500"
        activeClass="bg-sh-yellow-500 bg-opacity-70 text-sh-yellow-500 border-2 border-sh-yellow-500 border-opacity-70"
        pin={gameCode}
      />
    </div>

    <div class="w-full flex flex-col gap-5">
      <Players fillRemaining={true} players={$gameData?.players} showTitle={true} />

      {#if $gameData?.isOwner && btnSettings !== undefined}
        <div
          class="md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:z-20 md:w-full md:shadow-2xl md:shadow-white/10"
          class:md:hidden={!showSettings}
          use:clickOutside={{ callback: () => (showSettings = false), excluded: [btnSettings] }}
        >
          <Settings bind:hideAvatars bind:skipLongIntro />
        </div>
      {/if}

      {#if $gameData?.isOwner}
        <div class="flex gap-2">
          <SHButton
            bind:btn={btnSettings}
            enabled={!isStarting}
            extraClasses="w-fit hidden md:flex"
            bind:forceActiveState={showSettings}
            outlined={true}
            on:click={() => (showSettings = !showSettings)}
          >
            <iconify-icon class="text-2xl" icon="material-symbols:settings-outline" />
          </SHButton>

          <SHButton
            extraClasses="w-full"
            enabled={$gameData?.players?.length >= 5 && !isStarting}
            on:click={start}
          >
            {#if !isStarting}
              Start game
            {:else}
              Starting game...
            {/if}
          </SHButton>
        </div>
      {/if}

      <p class="text-sm text-center">
        <span>Waiting for others to join...</span>
        <br />
        <span>Min. required: 5/10 players</span>
      </p>

      <SHButton
        outlined={true}
        enabled={!isStarting}
        extraClasses="w-full gap-4"
        on:click={ApiClient.leaveGame}
      >
        <iconify-icon class="text-2xl" icon="material-symbols:logout" />
        Leave game
      </SHButton>
    </div>
  </div>
{/if}
