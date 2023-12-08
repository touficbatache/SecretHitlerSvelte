<script lang="ts">
  import { getContext } from "svelte"
  import type { Writable } from "svelte/store"

  import { browser } from "$app/environment"
  import { goto } from "$app/navigation"
  import { page } from "$app/stores"
  import * as ApiClient from "$lib/api_client"
  import type { ApiResponse } from "$lib/api_client"
  import PinInput from "$lib/components/PinInput.svelte"
  import Players from "$lib/components/Players.svelte"
  import PlayfulButton from "$lib/components/PlayfulButton.svelte"
  import Settings from "$lib/components/Settings.svelte"
  import SimpleButton from "$lib/components/SimpleButton.svelte"
  import type { GameData } from "$lib/game_data"
  import { Compact } from "$lib/enums"

  const gameCode: string = $page.data.gameCode
  const gameData: Writable<GameData> = getContext("gameData") as Writable<GameData>

  // TODO: make it false again if error, and show error
  let isStarting: boolean = false

  let hideAvatars: boolean = false
  let skipLongIntro: boolean = false

  $: if (browser) {
    if ($page.data.gameCode === undefined) {
      goto("/")
    }

    if ($gameData?.status !== undefined && $gameData?.status !== "waiting") {
      if ($gameData?.status === "settingUp") {
        goto("/intro")
      } else {
        goto("/gameplay")
      }
    }
  }

  async function start() {
    isStarting = true
    const response: ApiResponse = await ApiClient.startGame(gameCode, hideAvatars, skipLongIntro)
    if (response.error) {
      isStarting = false
    }
  }
</script>

{#if $gameData?.status === "waiting"}
  <div class="absolute top-7 right-7">
    <SimpleButton
      compact={true}
      disabled={isStarting}
      icon="fa:times"
      on:click={ApiClient.leaveGame}
    >
      Leave
    </SimpleButton>
  </div>

  <div
    class="w-full h-full px-6 py-20 flex flex-col justify-evenly items-center md:flex-row md:px-20 md:gap-20"
  >
    <div class="w-full flex flex-col items-center gap-5 md:h-full md:justify-evenly">
      <span class="text-2xl md:text-3xl">Game code</span>

      <PinInput
        isEnabled={false}
        inactiveClass="bg-button-500 text-sh-yellow-500"
        activeClass="bg-sh-yellow-500 bg-opacity-70 text-sh-yellow-500 border-2 border-sh-yellow-500 border-opacity-70"
        pin={gameCode}
      />

      {#if $gameData?.isOwner}
        <Settings classes="hidden md:flex" bind:hideAvatars bind:skipLongIntro />

        <PlayfulButton
          extraClasses="w-full hidden md:inline-block"
          enabled={$gameData?.players?.all?.length >= 5 && !isStarting}
          on:click={start}
        >
          {#if !isStarting}
            Start game
          {:else}
            Starting game...
          {/if}
        </PlayfulButton>
      {/if}
    </div>

    <div class="w-full flex flex-col gap-5 md:h-full md:justify-evenly">
      <Players
        compact={Compact.mobile}
        fillRemaining={true}
        hideEssentials={true}
        hideExtras={true}
        players={$gameData?.players?.all}
        showTitle={true}
      />

      <p class="text-center opacity-80 md:text-base">
        <span>Waiting for others to join...</span>
        <br />
        <span>Min. required: 5/10 players</span>
      </p>

      {#if $gameData?.isOwner}
        <Settings classes="md:hidden" bind:hideAvatars bind:skipLongIntro />

        <PlayfulButton
          extraClasses="w-full md:hidden"
          enabled={$gameData?.players?.all?.length >= 5 && !isStarting}
          on:click={start}
        >
          {#if !isStarting}
            Start game
          {:else}
            Starting game...
          {/if}
        </PlayfulButton>
      {/if}
    </div>
  </div>
{/if}
