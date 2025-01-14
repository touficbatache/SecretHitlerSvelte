<script lang="ts">
  import { createEventDispatcher } from "svelte"

  import CountDown from "$lib/components/CountDown.svelte"
  import FloatingWindow from "$lib/components/FloatingWindow.svelte"
  import Players from "$lib/components/Players.svelte"
  import PlayerView from "$lib/components/PlayerView.svelte"
  import PlayfulButton from "$lib/components/PlayfulButton.svelte"
  import type { GameDataPlayers, PresidentialPower } from "$lib/game_data"
  import type { Player } from "$lib/player"

  export let open: boolean
  export let players: GameDataPlayers | undefined = undefined
  export let president: Player | undefined = undefined
  export let presidentialPower: PresidentialPower | undefined = undefined

  const dispatch = createEventDispatcher()

  let selectedPlayer: Player | undefined = undefined

  $: executablePlayers =
    players?.all.filter((player) => !player.isExecuted && !player.isPresident) ?? []
  $: isPresident = players?.self?.isPresident ?? false
  $: visibleRolePlayerIds = players?.visibleRolePlayerIds() ?? []
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
          showRole={visibleRolePlayerIds.includes(president.id)}
        />
      </div>
    </div>
    <div class="w-full flex flex-col items-center gap-10">
      <span class="text-xl text-center mb-2 md:whitespace-nowrap">
        {#if isPresident}
          Execute a player
        {:else}
          The President is executing&nbsp;a&nbsp;player...
        {/if}
      </span>
      <Players
        players={executablePlayers}
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
          enabled={selectedPlayer !== undefined && presidentialPower === undefined}
          on:click={() => {
            if (selectedPlayer !== undefined) {
              dispatch("click", selectedPlayer.id)
              selectedPlayer = undefined
            }
          }}
          size="small"
        >
          Execute
        </PlayfulButton>
      {/if}
      <CountDown trigger={presidentialPower === "done"} />
    </div>
  </div>
</FloatingWindow>
