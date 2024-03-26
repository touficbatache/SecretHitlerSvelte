<script lang="ts">
  import { createEventDispatcher } from "svelte"

  import Deck from "$lib/components/Deck.svelte"
  import FloatingWindow from "$lib/components/FloatingWindow.svelte"
  import PlayerView from "$lib/components/PlayerView.svelte"
  import PlayfulButton from "$lib/components/PlayfulButton.svelte"
  import type { GameDataPlayers, GameDataSession } from "$lib/game_data"

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
    class="md:w-screen md:max-w-4xl flex flex-col md:flex-row justify-center items-center px-6 md:px-16 py-8 shadow-frame bg-[#141414] rounded-lg gap-10 md:gap-48"
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
            player={currentSession?.president()}
            hideExtras={true}
            hideVotes={true}
            showRole={visiblePlayerIds?.includes(currentSession.presidentId)}
          />
          <PlayerView
            player={currentSession.chancellor()}
            hideExtras={true}
            hideVotes={true}
            showRole={visiblePlayerIds?.includes(currentSession.chancellorId)}
          />
        </div>
      </div>
    {/if}
    <div class="flex flex-col items-center gap-6">
      <p class="text-center">
        <span>
          {#if isPresident}
            Swipe and choose 1 policy to discard
          {:else}
            The President is discarding 1 policy
          {/if}
        </span>
        <br />
        <span class="text-sm text-white text-opacity-60">
          {#if isPresident}
            The remaining 2 will go to your Chancellor
          {:else if isChancellor}
            The remaining 2 will go to you
          {:else}
            The remaining 2 will go to their Chancellor
          {/if}
        </span>
      </p>
      <div class="w-60 h-60 mb-10">
        <Deck
          cards={currentSession?.presidentPolicies}
          center={true}
          expanded={!isPresident}
          interactive={isPresident}
          on:select={({ detail }) => (selectedPolicy = detail)}
          selectable={true}
        />
      </div>
      {#if isPresident}
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
      {#if isPresident}
        <span class="text-sm text-center text-neutral-400">
          <iconify-icon
            class="align-[-0.14rem]"
            icon="fa:info-circle"
          />&nbsp;&nbsp;Next,&nbsp;your&nbsp;Chancellor&nbsp;will
          choose&nbsp;which&nbsp;policy&nbsp;to&nbsp;enact
        </span>
      {:else if isChancellor}
        <span class="text-sm text-center text-neutral-400">
          <iconify-icon
            class="align-[-0.14rem]"
            icon="fa:info-circle"
          />&nbsp;&nbsp;Next,&nbsp;you&nbsp;will&nbsp;choose which&nbsp;policy&nbsp;to&nbsp;enact
        </span>
      {:else}
        <span class="text-sm text-center text-neutral-400">
          <iconify-icon
            class="align-[-0.14rem]"
            icon="fa:info-circle"
          />&nbsp;&nbsp;Next,&nbsp;the&nbsp;Chancellor&nbsp;will
          choose&nbsp;which&nbsp;policy&nbsp;to&nbsp;enact
        </span>
      {/if}
    </div>
  </div>
</FloatingWindow>
