<script lang="ts">
  import { fly } from "svelte/transition"

  import { browser } from "$app/environment"
  import type { ApiResponse } from "$lib/api_client"
  import * as ApiClient from "$lib/api_client"
  import Deck from "$lib/components/Deck.svelte"
  import FloatingWindow from "$lib/components/FloatingWindow.svelte"
  import PlayerView from "$lib/components/PlayerView.svelte"
  import PlayfulButton from "$lib/components/PlayfulButton.svelte"
  import type { GameDataPlayers, PresidentialPower } from "$lib/game_data"
  import type { Player } from "$lib/player"

  export let gameCode: string
  export let open: boolean
  export let players: GameDataPlayers | undefined = undefined
  export let president: Player | undefined = undefined
  export let presidentialPower: PresidentialPower | undefined = undefined

  let cards: string[] = []
  let countDown: number = 4
  let isSetup: boolean = false
  const sessionStorageKey: string = "policyPeek"

  $: isPresident = players?.self?.isPresident ?? false

  $: if (browser && open) {
    policyPeek()
  }

  $: if (presidentialPower === "done") {
    setupCountdown()
  }

  function setupCountdown() {
    if (isSetup) {
      return
    }

    isSetup = true

    setTimeout(async () => {
      while (countDown > 0) {
        countDown--
        await new Promise((f) => setTimeout(f, 1000))
      }
    }, 2000)
  }

  async function policyPeek() {
    if (isPresident) {
      const sessionStorageCache: string | null = sessionStorage.getItem(sessionStorageKey)
      if (sessionStorageCache != null) {
        cards = sessionStorageCache.split(",")
      } else if (presidentialPower === undefined) {
        const response: ApiResponse = await ApiClient.presidentialPower_policyPeek(gameCode)
        if (response.error === undefined && response.success?.policies !== undefined) {
          cards = response.success?.policies.split(",")
          sessionStorage.setItem(sessionStorageKey, response.success?.policies)
        }
      }
    } else {
      cards = ["", "", ""]
    }
  }

  function nextElection() {
    if (isPresident && presidentialPower === "consumed") {
      ApiClient.presidentialPower_policyPeek(gameCode)
      setTimeout(async () => {
        sessionStorage.removeItem(sessionStorageKey)
        cards = []
      }, 10000)
    }
  }
</script>

<FloatingWindow
  allowDismiss={false}
  allowMinimize={true}
  bind:open
  classes="w-full md:w-fit px-4"
  on:minimize
>
  <div
    class="md:w-screen md:max-w-4xl flex flex-col md:flex-row justify-center items-center px-6 md:px-16 py-8 shadow-frame bg-[#141414] rounded-lg gap-10 md:gap-48"
  >
    <div class="flex flex-col items-center gap-6">
      {#if isPresident}
        <p class="flex flex-col items-center">
          <span class="text-xl font-futura">You are the </span>
          <span class="text-4xl font-eskapade_fraktur -mt-1">President</span>
        </p>
      {/if}
      <div class="w-1/3">
        <PlayerView
          player={president}
          hideExtras={true}
          hideVotes={true}
          showRole={(players?.visiblePlayerIds() ?? []).includes(president.id)}
        />
      </div>
      <span class="text-center">
        {#if isPresident}
          Swipe and peek at the&nbsp;next&nbsp;3&nbsp;policies
        {:else}
          The President is peeking at the&nbsp;next&nbsp;3&nbsp;policies
        {/if}
      </span>
      <div class="w-60 h-60 mb-10">
        <Deck {cards} center={true} interactive={isPresident} />
      </div>
      {#if isPresident}
        <PlayfulButton
          enabled={presidentialPower === "consumed"}
          on:click={nextElection}
          small={true}
        >
          Done
        </PlayfulButton>
        <span class="text-sm text-center text-neutral-400">
          <iconify-icon class="align-[-0.14rem]" icon="fa:info-circle" />&nbsp;&nbsp;Remember the
          policies' order!
        </span>
      {/if}
      <div class="relative">
        <span class="text-2xl invisible">{countDown}</span>
        {#key countDown}
          <span
            class="absolute inset-0 text-2xl"
            in:fly={{ duration: 700, y: "30px" }}
            out:fly={{ duration: 200, y: "-30px" }}
          >
            {4 > countDown && countDown > 0 ? countDown : ""}
          </span>
        {/key}
      </div>
    </div>
  </div>
</FloatingWindow>
