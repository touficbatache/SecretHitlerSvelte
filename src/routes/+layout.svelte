<script lang="ts">
  import "../app.postcss"
  import "iconify-icon"
  import { onMount, setContext } from "svelte"
  import { type Writable, writable } from "svelte/store"

  import { PUBLIC_FIREBASE_CONFIG } from "$env/static/public"

  import { browser } from "$app/environment"
  import { goto } from "$app/navigation"
  import * as ApiClient from "$lib/api_client"
  import { initializeFirebase } from "$lib/firebase"
  import type { GameData } from "$lib/game_data"

  import type { LayoutData } from "./$types"

  export let data: LayoutData

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
  </main>
</div>
