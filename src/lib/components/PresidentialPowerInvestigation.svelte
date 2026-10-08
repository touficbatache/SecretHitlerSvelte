<script lang="ts">
  import { browser } from "$app/environment"
  import type { GameplayApiResponse } from "$lib/api_client"
  import * as ApiClient from "$lib/api_client"
  import CountDown from "$lib/components/CountDown.svelte"
  import FloatingWindow from "$lib/components/FloatingWindow.svelte"
  import Players from "$lib/components/Players.svelte"
  import PlayerView from "$lib/components/PlayerView.svelte"
  import PlayfulButton from "$lib/components/PlayfulButton.svelte"
  import type { GameDataPlayers, PresidentialPower } from "$lib/game_data"
  import type { Player } from "$lib/player"
  import {
    powerCacheKey,
    readPowerCache,
    removePowerCache,
    writePowerCache,
  } from "$lib/power_cache"
  import { createTimers, type Timers } from "$lib/timers"

  const timers: Timers = createTimers()

  export let beingInvestigatedPlayerId: string | undefined
  export let enactedPolicyCount: number
  export let gameCode: string
  export let open: boolean
  export let players: GameDataPlayers | undefined = undefined
  export let president: Player | undefined = undefined
  export let presidentialPower: PresidentialPower | undefined = undefined
  /** When the pause after this phase ends (server time), if the game is in it. */
  export let pauseEndsAt: number | undefined = undefined

  let isRequestSent: boolean = false
  let membership: string | undefined = undefined
  let selectedPlayer: Player | undefined = undefined

  $: nonInvestigatedPlayers =
    players?.alive().filter((player) => !player.isPresident && !player.isInvestigated) ?? []
  $: isPresident = players?.self?.isPresident ?? false
  $: visibleRolePlayerIds = players?.visibleRolePlayerIds() ?? []

  $: cacheKey = powerCacheKey("investigation", gameCode, enactedPolicyCount)

  $: if (browser && open) {
    restoreInvestigation(cacheKey)
  }

  function restoreInvestigation(cacheKey: string) {
    const cachedInvestigation: string | null = readPowerCache("investigation", cacheKey)
    if (cachedInvestigation != null) {
      const storageJson: { membership: string; player: Player } = JSON.parse(cachedInvestigation)
      membership = storageJson.membership
      selectedPlayer = storageJson.player
    }
  }

  $: if (beingInvestigatedPlayerId !== undefined) {
    selectedPlayer = players?.all.find((player) => player.id === beingInvestigatedPlayerId)
    if (beingInvestigatedPlayerId === players?.self.id) {
      membership = players?.self?.membership
    } else if (!isPresident) {
      // The President keeps the membership the investigation revealed to them
      membership = undefined
    }
  }

  async function investigateLoyalty() {
    if (isPresident && selectedPlayer !== undefined) {
      isRequestSent = true
      const response: GameplayApiResponse = await ApiClient.presidentialPower_investigation(
        gameCode,
        selectedPlayer.id,
      )
      if (response.error === undefined) {
        membership = response.success?.membership
        writePowerCache(
          cacheKey,
          JSON.stringify({
            membership: response.success?.membership,
            player: selectedPlayer,
          }),
        )
      } else {
        isRequestSent = false
      }
    }
  }

  function nextElection() {
    if (isPresident && presidentialPower === "consumed") {
      const investigationCacheKey: string = cacheKey
      ApiClient.presidentialPower_investigation(gameCode)

      timers.setTimeout(() => {
        removePowerCache(investigationCacheKey)
        membership = undefined
        selectedPlayer = undefined
      }, 10000)
    }
  }
</script>

<FloatingWindow
  allowDismiss={false}
  allowMinimize={true}
  bind:open
  classes="w-full px-4 md:w-auto md:h-full md:py-4 md:flex md:items-center"
  on:minimize
>
  <div
    class="md:w-screen md:max-w-4xl flex flex-col md:grid md:grid-cols-2 items-center p-10 md:px-24 shadow-frame bg-[#141414] rounded-lg gap-10 md:gap-24"
  >
    <div class="w-full flex flex-col items-center gap-10">
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
          showRole={president !== undefined && visibleRolePlayerIds.includes(president.id)}
        />
      </div>
    </div>
    <div class="w-full flex flex-col items-center gap-10">
      {#if presidentialPower === undefined}
        <span class="text-center">
          {#if isPresident}
            Investigate a player's loyalty
          {:else}
            The President is investigating a&nbsp;player's&nbsp;loyalty
          {/if}
        </span>
        <Players
          players={nonInvestigatedPlayers}
          cols={3}
          hideExtras={true}
          hidePlacards={true}
          hideVotes={true}
          highlightPlayer={selectedPlayer?.id}
          on:click={isPresident ? ({ detail }) => (selectedPlayer = detail) : undefined}
          showRoles={visibleRolePlayerIds}
        />
        {#if isPresident}
          <PlayfulButton
            enabled={selectedPlayer !== undefined && !isRequestSent}
            on:click={investigateLoyalty}
            size="small"
          >
            Investigate
          </PlayfulButton>
        {/if}
      {:else}
        <span class="text-center">
          {#if isPresident}
            You're seeing {selectedPlayer?.name}'s&nbsp;membership&nbsp;card
          {:else if players?.self.id === selectedPlayer?.id}
            The President is seeing your&nbsp;membership&nbsp;card
          {:else}
            The President is seeing {selectedPlayer?.name}'s&nbsp;membership&nbsp;card
          {/if}
        </span>
        <div
          class="w-1/2 rounded-lg aspect-[7/10] bg-contain bg-center"
          class:bg-card-membership-liberal={membership === "liberal"}
          class:bg-card-membership-fascist={membership === "fascist"}
          class:bg-card-membership-backcover={membership === undefined}
        />
        {#if isPresident}
          <PlayfulButton enabled={presidentialPower !== "done"} on:click={nextElection} size="small"
            >Done</PlayfulButton
          >
        {/if}
      {/if}
      <CountDown until={pauseEndsAt} />
    </div>
  </div>
</FloatingWindow>
