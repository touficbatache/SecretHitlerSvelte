<script lang="ts">
  import { onMount } from "svelte"

  import { goto } from "$app/navigation"
  import { page } from "$app/stores"
  import * as ApiClient from "$lib/api_client"
  import type { GameplayApiResponse } from "$lib/api_client"
  import PinInput from "$lib/components/PinInput.svelte"
  import PlayfulButton from "$lib/components/PlayfulButton.svelte"
  import PlayfulIconButton from "$lib/components/PlayfulIconButton.svelte"

  let error: string = ""
  let gameCode: string = ""
  let isJoining: boolean = false

  async function join() {
    error = ""
    isJoining = true
    const response: GameplayApiResponse = await ApiClient.joinGame(gameCode)
    if (response.success) {
      await goto("/waitingRoom")
    }
    if (response.error !== undefined) {
      error = `${response.error.code} - ${response.error.message}`
      isJoining = false
    }
  }

  onMount(() => {
    if ($page.data.gameCode !== undefined) {
      goto("/reconnect")
    }
  })
</script>

{#if $page.data.gameCode === undefined}
  <form class="w-full h-full px-6 md:px-60 flex flex-col justify-center items-center gap-10">
    <div class="absolute top-0 left-0">
      <PlayfulIconButton
        extraClasses="w-10 h-[36px] m-4 aspect-square"
        icon="fa:arrow-left"
        on:click={() => window.history.back()}
        type="button"
      />
    </div>
    <span class="text-2xl">Enter game code</span>
    <PinInput
      isEnabled={!isJoining}
      inactiveClass="bg-button-500 text-sh-yellow-500"
      activeClass="bg-sh-yellow-500 bg-opacity-70 text-sh-yellow-500 border-2 border-sh-yellow-500 border-opacity-70"
      bind:pin={gameCode}
    />
    {#if error.length > 0}
      <span class="text-[#B71C1C]">Error: {error}</span>
    {/if}
    <PlayfulButton
      enabled={gameCode.length === 6 && !isJoining}
      extraClasses="w-full"
      on:click={join}
      type="submit"
    >
      {#if !isJoining}
        Join
      {:else}
        Joining...
      {/if}
    </PlayfulButton>
  </form>
{/if}
