<script lang="ts">
  import "../app.postcss"
  import "iconify-icon"
  import { onDestroy, setContext } from "svelte"
  import { writable, type Writable } from "svelte/store"

  import type { LayoutData } from "./$types"

  import { browser } from "$app/environment"
  import { page } from "$app/stores"
  import * as ApiClient from "$lib/api_client"
  import FloatingWindow from "$lib/components/FloatingWindow.svelte"
  import PlayfulButton from "$lib/components/PlayfulButton.svelte"
  import PlayfulTextField from "$lib/components/PlayfulTextField.svelte"
  import { initializeFirebase, rtdb, setUserName } from "$lib/firebase"
  import { gameDataStore } from "$lib/game_data"
  import { isGameRoute, trackPresence } from "$lib/presence"

  export let data: LayoutData

  const contentOverflow: Writable<boolean> = writable(false)
  setContext("contentOverflow", contentOverflow)

  const contentShiftRight: Writable<boolean> = writable(false)
  setContext("contentShiftRight", contentShiftRight)

  let nickname: string = ""
  let error: string = ""

  $: if (browser) {
    try {
      initializeFirebase(data.firebaseAppConfig, data.recaptchaSiteKey, data.debugMode)
    } catch (error) {
      console.error(error)
    }

    if (data.user?.token) {
      ApiClient.init(data.apiURL, data.user.token)
    }

    if (data.gameCode !== undefined && data.user?.uid !== undefined) {
      setContext("gameData", gameDataStore(rtdb, data.gameCode))
    }
  }

  // Presence lives here rather than in each game page, so moving between the waiting room,
  // the intro and the gameplay keeps the player connected instead of briefly disconnecting.
  let presenceKey: string | undefined
  let stopPresence: (() => void) | undefined

  $: if (browser) {
    updatePresence(
      isGameRoute($page.route.id) && data.gameCode !== undefined && data.user?.uid !== undefined
        ? { gameCode: data.gameCode, userId: data.user.uid }
        : undefined,
    )
  }

  function updatePresence(target: { gameCode: string; userId: string } | undefined) {
    const key: string | undefined = target && `${target.gameCode}/${target.userId}`
    if (key === presenceKey) return

    stopPresence?.()
    stopPresence = target && trackPresence(rtdb, target.gameCode, target.userId)
    presenceKey = key
  }

  onDestroy(() => stopPresence?.())
</script>

<div
  class="w-screen h-screen bg-checkerboard bg-center bg-cover md:bg-136 md:px-56 md:py-16 transition-all duration-500 ease-out"
  class:md:px-56={!$contentShiftRight}
  class:md:pl-96={$contentShiftRight}
  class:md:pr-16={$contentShiftRight}
>
  <main
    class="w-full h-full mx-auto flex justify-center items-center md:frame-indented md:bg-[#141414]"
    class:relative={!$contentOverflow}
    class:overflow-hidden={!$contentOverflow}
  >
    <slot />
  </main>

  <FloatingWindow
    allowDismiss={false}
    classes="w-full md:w-auto px-10 md:px-0"
    open={data.user !== undefined && data.user.name === undefined}
  >
    <div class="py-6 flex flex-col shadow-frame-glowing bg-neutral-900 rounded-lg">
      <div class="flex flex-col gap-6 px-6">
        <span>Your teammates still can't recognize you!</span>
        <span>Choose a nickname 😎</span>
        <div class="flex flex-col">
          <PlayfulTextField
            bind:value={nickname}
            label="Your nickname"
            on:input={() => {
              error = ""
              nickname = nickname
                .toLowerCase()
                .replace(/[^a-z]+/g, "")
                .slice(0, 10)
            }}
            type="text"
          />
          <span class="text-[#B71C1C] transition-opacity" class:opacity-0={error.length === 0}>
            Error: {error}
          </span>
        </div>
        <PlayfulButton
          extraClasses="w-fit self-end"
          size="small"
          on:click={() => {
            if (nickname.trim().length === 0) {
              error = "Enter a nickname"
            } else if (nickname.trim().length < 3) {
              error = "At least 3 characters"
            } else if (nickname.trim().length > 10) {
              error = "Character limit is 10"
            } else {
              setUserName(nickname)
            }
          }}
        >
          Save
        </PlayfulButton>
      </div>
    </div>
  </FloatingWindow>
</div>
