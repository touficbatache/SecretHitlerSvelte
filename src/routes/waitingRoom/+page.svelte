<script lang="ts">
  import {
    onDisconnect as onDisconnectRef,
    ref as dbRef,
    set as setRef,
    type Unsubscribe,
  } from "@firebase/database"
  import Icon from "@iconify/svelte"
  import { type DatabaseReference, onValue } from "firebase/database"
  import { getContext, onMount } from "svelte"
  import type { Readable } from "svelte/store"

  import { browser } from "$app/environment"
  import { beforeNavigate, goto } from "$app/navigation"
  import { page } from "$app/stores"
  import * as ApiClient from "$lib/api_client"
  import { type GameplayApiResponse } from "$lib/api_client"
  import { copyToClipboard } from "$lib/clipboard"
  import ElevatedText from "$lib/components/ElevatedText.svelte"
  import FloatingWindow from "$lib/components/FloatingWindow.svelte"
  import PinInput from "$lib/components/PinInput.svelte"
  import Players from "$lib/components/Players.svelte"
  import PlayfulButton from "$lib/components/PlayfulButton.svelte"
  import PlayfulIconButton from "$lib/components/PlayfulIconButton.svelte"
  import PlayfulSpinner from "$lib/components/PlayfulSpinner.svelte"
  import Settings from "$lib/components/Settings.svelte"
  import SimpleButton from "$lib/components/SimpleButton.svelte"
  import { Compact } from "$lib/enums"
  import { rtdb } from "$lib/firebase"
  import type { GameData } from "$lib/game_data"

  const gameCode: string = $page.data.gameCode
  const gameData: Readable<GameData> = getContext("gameData") as Readable<GameData>

  let presenceListenerUnsubscribe: Unsubscribe | undefined

  let showUnjoinWarning: boolean = false
  let showUnjoiningLoading: boolean = false

  let hideAvatars: boolean = false
  let skipLongIntro: boolean = false

  let showPublicVisibilityStreamerModeWarning: boolean = false
  let modifyingGameVisibility: boolean = false

  let copiedGameCode: string | undefined = undefined

  let isStarting: boolean = false
  let startingError: string = ""

  $: if (browser) {
    if ($page.data.gameCode === undefined) {
      goto("/", { replaceState: true })
    }

    if ($gameData?.status !== undefined && $gameData?.status !== "waiting") {
      if ($gameData?.status === "settingUp") {
        goto("/intro", { replaceState: true })
      } else {
        goto("/gameplay", { replaceState: true })
      }
    }
  }

  onMount(() => {
    setupPresence(gameCode)
  })

  function setupPresence(gameCode: any) {
    if ($page.data.user?.uid !== undefined) {
      const gameUserConnectedRef: DatabaseReference = dbRef(
        rtdb,
        `ongoingGames/${gameCode}/connected/${$page.data.user.uid}`,
      )
      const connectedRef: DatabaseReference = dbRef(rtdb, ".info/connected")
      presenceListenerUnsubscribe = onValue(connectedRef, (snapshot) => {
        if (snapshot.val() === true) {
          onDisconnectRef(gameUserConnectedRef).set(false)
          setRef(gameUserConnectedRef, true)
        }
      })
    }
  }

  async function unJoin() {
    showUnjoinWarning = false
    showUnjoiningLoading = true
    await ApiClient.unJoinGame(gameCode)
    showUnjoiningLoading = false
  }

  function copyGameCode(gameCode: string) {
    copyToClipboard(gameCode, () => {
      copiedGameCode = gameCode
      setTimeout(() => {
        copiedGameCode = undefined
      }, 2000)
    })
  }

  async function toggleGameVisibility(force: boolean = false) {
    if ($page.data.streamerModeEnabled && $gameData.visibility === "private" && !force) {
      showPublicVisibilityStreamerModeWarning = true
    } else {
      modifyingGameVisibility = true
      await ApiClient.setGameVisibility(
        gameCode,
        $gameData.visibility === "private" ? "public" : "private",
      )
      modifyingGameVisibility = false
    }
  }

  async function start() {
    startingError = ""
    isStarting = true
    const response: GameplayApiResponse = await ApiClient.startGame(
      gameCode,
      hideAvatars,
      skipLongIntro,
    )
    if (response.error) {
      isStarting = false
      startingError = response.error.message
    }
  }

  beforeNavigate(({ to }) => {
    if (gameCode !== undefined && to !== undefined && to.route.id !== "gameplay") {
      if (presenceListenerUnsubscribe !== undefined) {
        presenceListenerUnsubscribe()
      }
      const gameUserConnectedRef: DatabaseReference = dbRef(
        rtdb,
        `ongoingGames/${gameCode}/connected/${$page.data.user.uid}`,
      )
      setRef(gameUserConnectedRef, false)
    }
  })
</script>

{#if $gameData?.status === "waiting"}
  <FloatingWindow
    bind:open={showPublicVisibilityStreamerModeWarning}
    classes="w-full md:w-auto px-10 md:px-0"
  >
    <div class="px-6 py-6 flex flex-col gap-4 bg-[#141414] shadow-frame rounded-lg">
      <div class="flex items-center gap-3">
        <Icon class="text-xl" icon="fa:warning" />
        <h5 class="text-xl md:text-2xl">Streamer mode is on</h5>
      </div>
      <span>Are you sure you want to make your game public?</span>
      <span>Anyone will be able to join.</span>
      <div class="self-center flex gap-2 mt-2">
        <PlayfulButton
          on:click={() => (showPublicVisibilityStreamerModeWarning = false)}
          size="extra-small"
        >
          Cancel
        </PlayfulButton>
        <PlayfulButton
          colors={{
            background: "#2c2c2c",
            backgroundLight: "#2f2f2f",
            backgroundRaised: "#222222",
            reflection: "rgba(255, 255, 255, 0.3)",
            text: "#d1d1d1",
          }}
          on:click={() => {
            showPublicVisibilityStreamerModeWarning = false
            toggleGameVisibility(true)
          }}
          size="extra-small"
        >
          Make public
        </PlayfulButton>
      </div>
    </div>
  </FloatingWindow>

  <FloatingWindow bind:open={showUnjoinWarning} classes="w-full md:w-auto px-10 md:px-0">
    <div class="px-6 py-6 flex flex-col gap-4 bg-[#141414] shadow-frame rounded-lg">
      <div class="flex items-center gap-3">
        <Icon class="text-xl" icon="fa:warning" />
        <h5 class="text-xl md:text-2xl">
          {#if $gameData.isOwner}
            You created this game
          {:else}
            You're about to leave this game
          {/if}
        </h5>
      </div>
      {#if $gameData.isOwner}
        <span>This game will be deleted and all players will be kicked out.</span>
      {/if}
      <span>Are you sure you want to continue?</span>
      <div class="self-center flex gap-2 mt-2">
        <PlayfulButton on:click={() => (showUnjoinWarning = false)} size="extra-small">
          Cancel
        </PlayfulButton>
        <PlayfulButton
          colors={{
            background: "#2c2c2c",
            backgroundLight: "#2f2f2f",
            backgroundRaised: "#222222",
            reflection: "rgba(255, 255, 255, 0.3)",
            text: "#d1d1d1",
          }}
          on:click={unJoin}
          size="extra-small"
        >
          Leave
          {#if $gameData.isOwner}
            & delete game
          {/if}
        </PlayfulButton>
      </div>
    </div>
  </FloatingWindow>

  <FloatingWindow
    allowDismiss={false}
    bind:open={showUnjoiningLoading}
    classes="flex flex-col items-center gap-5"
  >
    <PlayfulSpinner color="#fff" />

    <ElevatedText class="text-xl md:text-2xl" weight="extrabold">Leaving game...</ElevatedText>
  </FloatingWindow>

  <div class="absolute top-7 right-7 z-20">
    <SimpleButton
      compact={true}
      disabled={isStarting}
      icon="fa:times"
      on:click={() => {
        showUnjoinWarning = true
      }}
    >
      Leave
    </SimpleButton>
  </div>

  <div
    class="w-full h-full flex flex-col md:flex-row justify-evenly items-center gap-4 md:gap-20 px-6 pt-24 pb-8 md:px-16 md:py-10 overflow-y-auto"
  >
    <div
      class="w-full flex flex-col items-center gap-3 md:gap-5 md:h-full"
      class:md:justify-evenly={$gameData?.isOwner}
      class:md:justify-center={!$gameData?.isOwner}
    >
      <div class="flex items-center gap-4">
        <span class="text-2xl md:text-3xl">Game code</span>
        <PlayfulIconButton
          colors={{
            background: "#2c2c2c",
            backgroundLight: "#2f2f2f",
            backgroundRaised: "#222222",
            reflection: "rgba(255, 255, 255, 0.3)",
            text: "#d1d1d1",
          }}
          extraClasses="w-8 h-7 md:w-9 md:h-8 aspect-square justify-self-end"
          icon={copiedGameCode === gameCode ? "fa:check" : "ion:copy"}
          on:click={() => copyGameCode(gameCode)}
        />
      </div>

      <PinInput
        hidden={$page.data.streamerModeEnabled}
        isEnabled={false}
        inactiveClass="bg-button-500 text-sh-yellow-500"
        activeClass="bg-sh-yellow-500 bg-opacity-70 text-sh-yellow-500 border-2 border-sh-yellow-500 border-opacity-70"
        pin={gameCode}
      />

      {#if $gameData?.isOwner}
        <Settings classes="hidden md:flex" bind:hideAvatars bind:skipLongIntro />

        <PlayfulButton
          colors={$gameData.visibility === "private"
            ? {
                background: "#2c2c2c",
                backgroundLight: "#2f2f2f",
                backgroundRaised: "#222222",
                reflection: "rgba(255, 255, 255, 0.3)",
                text: "#afafaf",
              }
            : {
                background: "#ea6148",
                backgroundLight: "#ef664a",
                backgroundRaised: "#bb612b",
                text: "#fbe1c0",
              }}
          enabled={!modifyingGameVisibility}
          extraClasses="w-full hidden md:inline-block"
          icon="fa6-solid:tower-broadcast"
          on:click={() => toggleGameVisibility()}
          size="small"
        >
          Visibility:
          {#if $gameData.visibility === "private"}
            private
          {:else}
            public
          {/if}
        </PlayfulButton>

        <div class="w-full hidden md:block">
          <PlayfulButton
            extraClasses="w-full"
            enabled={$gameData?.players?.all?.length >= 5 && !isStarting}
            on:click={start}
          >
            {#if !isStarting}
              Start game
            {:else}
              Starting game...
            {/if}
          </PlayfulButton>

          <span>{startingError}</span>
        </div>
      {:else}
        <ElevatedText
          class="hidden md:inline-block w-full mt-6 px-3 py-1.5 text-lg tracking-wider rounded-lg opacity-70 transition-all {$gameData.visibility ===
          'private'
            ? 'text-neutral-300 bg-neutral-800'
            : 'text-[#fbe1c0] bg-[#ea6148]'}"
          weight="black"
        >
          <Icon class="my-auto text-base" icon="fa6-solid:tower-broadcast" />

          Game is
          {#if $gameData.visibility === "private"}
            private
          {:else}
            public
          {/if}
        </ElevatedText>
      {/if}
    </div>

    <div class="w-full md:h-full flex flex-col md:justify-evenly gap-5">
      <Players
        compact={Compact.mobile}
        fillRemaining={true}
        hideExtras={true}
        hidePlacards={true}
        hideVotes={true}
        highlight={true}
        players={$gameData?.players?.all}
        showCount={true}
      />

      <p class="text-center opacity-80 md:text-base">
        <span>Waiting for others to join...</span>
        <br />
        <span>Min. required: 5/10 players</span>
      </p>

      {#if $gameData?.isOwner}
        <Settings classes="md:hidden" bind:hideAvatars bind:skipLongIntro />

        <PlayfulButton
          colors={$gameData.visibility === "private"
            ? {
                background: "#2c2c2c",
                backgroundLight: "#2f2f2f",
                backgroundRaised: "#222222",
                reflection: "rgba(255, 255, 255, 0.3)",
                text: "#afafaf",
              }
            : {
                background: "#ea6148",
                backgroundLight: "#ef664a",
                backgroundRaised: "#bb612b",
                text: "#fbe1c0",
              }}
          enabled={!modifyingGameVisibility}
          extraClasses="w-full md:hidden"
          icon="fa6-solid:tower-broadcast"
          on:click={() => toggleGameVisibility()}
          size="small"
        >
          Visibility:
          {#if $gameData.visibility === "private"}
            private
          {:else}
            public
          {/if}
        </PlayfulButton>

        <div class="w-full md:hidden">
          <PlayfulButton
            extraClasses="w-full"
            enabled={$gameData?.players?.all?.length >= 5 && !isStarting}
            on:click={start}
          >
            {#if !isStarting}
              Start game
            {:else}
              Starting game...
            {/if}
          </PlayfulButton>

          <span>{startingError}</span>
        </div>
      {:else}
        <ElevatedText
          class="md:hidden w-full mt-6 px-3 py-1.5 text-lg font-black tracking-wider rounded-lg opacity-70 transition-all {$gameData.visibility ===
          'private'
            ? 'text-neutral-300 bg-neutral-800'
            : 'text-[#fbe1c0] bg-[#ea6148]'}"
        >
          <Icon class="my-auto text-base" icon="fa6-solid:tower-broadcast" />

          Game is
          {#if $gameData.visibility === "private"}
            private
          {:else}
            public
          {/if}
        </ElevatedText>
      {/if}
    </div>
  </div>
{/if}
