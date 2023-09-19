<script lang="ts">
  import "../app.postcss"
  import "iconify-icon"
  import { onMount, setContext } from "svelte"
  import { type Writable, writable } from "svelte/store"

  import { PUBLIC_FIREBASE_CONFIG } from "$env/static/public"

  import { browser } from "$app/environment"
  import { goto } from "$app/navigation"
  import * as ApiClient from "$lib/api_client"
  import PlayfulButton from "$lib/components/PlayfulButton.svelte"
  import SHTextField from "$lib/components/SHTextField.svelte"
  import { initializeFirebase, setUserName } from "$lib/firebase"
  import type { GameData } from "$lib/game_data"

  import type { LayoutData } from "./$types"

  export let data: LayoutData

  let userName = ""
  let error = ""

  const gameData: Writable<GameData> = writable({})
  setContext("gameData", gameData)

  let lastUpdate
  let sse

  $: if (browser) {
    try {
      initializeFirebase(JSON.parse(PUBLIC_FIREBASE_CONFIG))
    } catch (error) {
      console.error(error)
    }

    if (!data.user) {
      goto("/login")
    }
  }

  $: if (data.user?.token) {
    ApiClient.init(data.user.token)
  }

  $: if (browser && data.lastUpdate !== lastUpdate) {
    lastUpdate = data.lastUpdate
    if (sse) {
      sse.close()
    }
    sse = new EventSource("/")
    sse.onmessage = (event) => {
      $gameData = JSON.parse(event.data)
    }
  }

  onMount(() => {
    // const sse = new EventSource("/")
    // sse.onmessage = (event) => {
    //   $gameData = JSON.parse(event.data)
    //   console.log($gameData)
    // }
    return () => sse.close()
  })
</script>

<div class="w-screen h-screen bg-checkerboard bg-center bg-cover md:bg-136">
  <main class="relative w-full h-full mx-auto flex justify-center items-center md:max-w-sm">
    <slot />

    {#if data.user !== undefined && data.user.name === undefined}
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-full px-10 md:px-0"
      >
        <div class="py-6 flex flex-col bg-[#424242] shadow-2xl shadow-white/10 rounded-lg">
          <div class="flex flex-col gap-6 px-6">
            <span>Your teammates still can't recognize you!</span>
            <span>What would you like to go by?</span>
            <div class="flex flex-col">
              <SHTextField
                label="Your name"
                type="text"
                bind:value={userName}
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
                if (userName.trim().length === 0) {
                  error = "Enter a name"
                } else if (userName.trim().length < 3) {
                  error = "At least 3 characters"
                } else if (userName.trim().length > 15) {
                  error = "Character limit is 15"
                } else {
                  setUserName(userName)
                }
              }}
            >
              Save
            </PlayfulButton>
          </div>
        </div>
      </div>
    {/if}
  </main>
</div>
