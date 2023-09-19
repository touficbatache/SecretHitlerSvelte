<script lang="ts">
  import { onMount } from "svelte"

  import { goto } from "$app/navigation"
  import { page } from "$app/stores"
  import * as ApiClient from "$lib/api_client"
  import Spinner from "$lib/components/Spinner.svelte"
  import PlayfulSpinner from "$lib/components/PlayfulSpinner.svelte"

  onMount(() => {
    if ($page.data.gameCode === undefined) {
      setTimeout(async () => {
        const success = await ApiClient.newGame()
        if (success) {
          await goto("/waitingRoom")
        }
      }, 1000)
    } else {
      goto("/reconnect")
    }
  })
</script>

{#if $page.data.gameCode === undefined}
  <div class="w-full h-full px-6 flex flex-col justify-evenly items-center">
    <div class="w-full flex flex-col items-center gap-5">
      <!--      <div class="w-10 h-10">-->
      <!--        <Spinner color="#fff" />-->
      <!--      </div>-->

      <PlayfulSpinner color="#fff" />

      <span class="text-xl text-center">Creating game...</span>
    </div>
  </div>
{/if}
