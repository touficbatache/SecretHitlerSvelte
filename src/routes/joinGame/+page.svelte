<script lang="ts">
  import { onMount } from "svelte"

  import { goto } from "$app/navigation"
  import { page } from "$app/stores"
  import * as ApiClient from "$lib/api_client"
  import SHButton from "$lib/components/SHButton.svelte"
  import PinInput from "$lib/components/PinInput.svelte"

  let gameCode = ""

  // TODO: make it false again if error, and show error
  let isJoining = false

  async function join() {
    isJoining = true
    const response = await ApiClient.joinGame(gameCode)
    if (response.success) {
      await goto("/waitingRoom")
    }
    // TODO: make it false again if error, and show error
    // if (response.error !== undefined) {
    //   error = ""
    // }
  }

  onMount(() => {
    if ($page.data.gameCode !== undefined) {
      goto("/reconnect")
    }
  })
</script>

{#if $page.data.gameCode === undefined}
  <div class="w-full h-full px-6 flex flex-col justify-center items-center gap-6">
    <span class="text-xl">Enter game code</span>
    <PinInput
      isEnabled={!isJoining}
      inactiveClass="bg-button-500 text-sh-yellow-500"
      activeClass="bg-sh-yellow-500 bg-opacity-70 text-sh-yellow-500 border-2 border-sh-yellow-500 border-opacity-70"
      bind:pin={gameCode}
    />
    <SHButton enabled={gameCode.length === 6 && !isJoining} extraClasses="w-full" on:click={join}>
      {#if !isJoining}
        Join
      {:else}
        Joining...
      {/if}
    </SHButton>
  </div>
{/if}
