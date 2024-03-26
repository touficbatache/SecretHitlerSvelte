<script lang="ts">
  import { createEventDispatcher } from "svelte"

  import FloatingWindow from "$lib/components/FloatingWindow.svelte"
  import PlayfulButton from "$lib/components/PlayfulButton.svelte"
  import PlayerView from "$lib/components/PlayerView.svelte"
  import type { GameDataPlayers, GameDataSession } from "$lib/game_data"
  import Deck from "$lib/components/Deck.svelte"

  export let currentSession: GameDataSession | undefined = undefined
  export let open: boolean
  export let players: GameDataPlayers | undefined = undefined

  const dispatch = createEventDispatcher()

  let selectedPolicy: string | undefined

  $: isPresident = players?.self?.isPresident ?? false
  $: isChancellor = players?.self?.isChancellor ?? false
  $: visiblePlayerIds = players?.visiblePlayerIds() ?? []
</script>

<FloatingWindow
  allowDismiss={false}
  allowMinimize={true}
  bind:open
  classes="w-full md:w-fit px-4"
  on:minimize
>
  <div
    class="flex flex-col md:flex-row items-center px-6 md:px-16 py-8 shadow-frame bg-[#141414] rounded-lg gap-10 md:gap-32"
  >
    {#if currentSession?.presidentId !== undefined && currentSession?.chancellorId !== undefined}
      <div class="flex flex-col items-center gap-4 md:gap-10">
        <span class="text-2xl font-futura">
          {#if isPresident || isChancellor}
            Your Government
          {:else}
            The Government
          {/if}
        </span>
        <div class="w-full grid grid-cols-2 gap-8">
          <PlayerView
            player={currentSession.president()}
            hideExtras={true}
            hideVotes={true}
            showRole={visiblePlayerIds.includes(currentSession.presidentId)}
          />
          <PlayerView
            player={currentSession.chancellor()}
            hideExtras={true}
            hideVotes={true}
            showRole={visiblePlayerIds.includes(currentSession.chancellorId)}
          />
        </div>
      </div>
    {/if}
    <div class="flex flex-col items-center gap-6">
      <span class="text-center">
        {#if isChancellor}
          Swipe and choose 1 policy to discard
        {:else}
          The Chancellor is discarding 1 policy
        {/if}
      </span>
      <div class="w-60 h-60 mb-10">
        <Deck
          cards={currentSession?.chancellorPolicies}
          center={true}
          expanded={!isChancellor}
          interactive={isChancellor}
          on:select={({ detail }) => (selectedPolicy = detail)}
          selectable={true}
        />
      </div>
      {#if isChancellor}
        <PlayfulButton
          enabled={selectedPolicy !== undefined}
          on:click={() => {
            dispatch("click", selectedPolicy)
            open = false
            selectedPolicy = undefined
          }}
          small={true}
        >
          Discard
        </PlayfulButton>
      {/if}
      {#if isChancellor}
        <span class="text-sm text-center text-neutral-400">
          <iconify-icon class="align-[-0.14rem]" icon="fa:info-circle" />&nbsp;&nbsp;The President
          handed you 2&nbsp;policies,<br />you have to discard one and enact the other
        </span>
      {:else if isPresident}
        <span class="text-sm text-center text-neutral-400">
          <iconify-icon class="align-[-0.14rem]" icon="fa:info-circle" />&nbsp;&nbsp;You handed your
          Chancellor 2&nbsp;policies,<br />they have to discard one and enact the other
        </span>
      {:else}
        <span class="text-sm text-center text-neutral-400">
          <iconify-icon class="align-[-0.14rem]" icon="fa:info-circle" />&nbsp;&nbsp;The Chancellor
          was handed 2&nbsp;policies,<br />they have to discard one and enact the other
        </span>
      {/if}
    </div>
  </div>
</FloatingWindow>
