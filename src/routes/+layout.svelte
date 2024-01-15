<script lang="ts">
  import "../app.postcss"
  import "iconify-icon"
  import { setContext } from "svelte"
  import { writable, type Writable } from "svelte/store"

  import { browser } from "$app/environment"
  import { goto } from "$app/navigation"
  import * as ApiClient from "$lib/api_client"
  import FloatingWindow from "$lib/components/FloatingWindow.svelte"
  import PlayfulButton from "$lib/components/PlayfulButton.svelte"
  import SHTextField from "$lib/components/SHTextField.svelte"
  import { castGameData, initializeFirebase, rtdb, setUserName } from "$lib/firebase"
  import type { GameData } from "$lib/game_data"
  import { nodeStore } from "$lib/stores/rtdb"

  import type { LayoutData } from "./$types"

  export let data: LayoutData

  const contentOverflow: Writable<boolean> = writable(false)
  setContext("contentOverflow", contentOverflow)

  const contentShiftRight: Writable<boolean> = writable(false)
  setContext("contentShiftRight", contentShiftRight)

  let nickname: string = ""
  let error: string = ""

  $: if (browser) {
    try {
      initializeFirebase(data.firebaseAppConfig, data.devMode)
    } catch (error) {
      console.error(error)
    }

    if (!data.user) {
      goto("/login")
    }

    if (data.user?.token) {
      ApiClient.init(data.user.token)
    }

    if (data.gameCode !== undefined && data.user?.uid !== undefined) {
      setContext(
        "gameData",
        nodeStore<GameData>(rtdb, `ongoingGames/${data.gameCode}`, castGameData),
      )
    }
  }
</script>

<div
  class="w-screen h-screen bg-checkerboard bg-center bg-cover md:bg-136 md:px-56 md:py-16 transition-all duration-500 ease-out"
  class:md:px-56={!$contentShiftRight}
  class:md:pl-96={$contentShiftRight}
  class:md:pr-16={$contentShiftRight}
>
  <main
    class="w-full h-full mx-auto flex justify-center items-center md:frame md:bg-[#141414]"
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
    <div class="py-6 flex flex-col bg-[#424242] shadow-2xl shadow-white/10 rounded-lg">
      <div class="flex flex-col gap-6 px-6">
        <span>Your teammates still can't recognize you!</span>
        <span>What would you like to go by?</span>
        <div class="flex flex-col">
          <SHTextField
            label="Your nickname"
            type="text"
            bind:value={nickname}
            on:input={() => (error = "")}
          />
          <span class="text-[#B71C1C] transition-opacity" class:opacity-0={error.length === 0}>
            Error: {error}
          </span>
        </div>
        <PlayfulButton
          extraClasses="w-fit self-end"
          small={true}
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
