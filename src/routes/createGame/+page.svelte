<script lang="ts">
  import { onMount } from "svelte"

  import { goto } from "$app/navigation"
  import { page } from "$app/stores"
  import * as ApiClient from "$lib/api_client"
  import ElevatedText from "$lib/components/ElevatedText.svelte"
  import PlayfulSpinner from "$lib/components/PlayfulSpinner.svelte"

  onMount(() => {
    if ($page.data.gameCode === undefined) {
      setTimeout(async () => {
        const success: boolean = await ApiClient.newGame()
        if (success) {
          await goto("/waitingRoom", { replaceState: true })
        }
      }, 1000)
    } else {
      goto("/reconnect", { replaceState: true })
    }
  })
</script>

{#if $page.data.gameCode === undefined}
  <div class="w-full h-full flex flex-col justify-center items-center gap-5 px-6">
    <PlayfulSpinner color="#fff" />

    <ElevatedText class="text-xl md:text-2xl" weight="extrabold">Creating game...</ElevatedText>
  </div>
{/if}
