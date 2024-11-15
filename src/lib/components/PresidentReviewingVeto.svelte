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

  $: isPresident = players?.self?.isPresident ?? false
  $: isChancellor = players?.self?.isChancellor ?? false
  $: visibleRolePlayerIds = players?.visibleRolePlayerIds() ?? []
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
            showRole={visibleRolePlayerIds?.includes(currentSession.presidentId)}
          />
          <PlayerView
            player={currentSession.chancellor()}
            hideExtras={true}
            hideVotes={true}
            showRole={visibleRolePlayerIds?.includes(currentSession.chancellorId)}
          />
        </div>
      </div>
    {/if}
    <div class="flex flex-col items-center gap-6">
      <p class="text-center">
        <span>
          {#if isPresident}
            Your Chancellor is seeking a Veto
          {:else}
            The Chancellor is seeking a Veto
          {/if}
        </span>
        <br />
        <span class="text-sm text-white text-opacity-60">
          {#if isPresident}
            If you accept, both policies will be discarded
          {:else}
            If accepted, both policies will be discarded
          {/if}
        </span>
      </p>
      <div class="w-60 h-60 mb-10">
        <Deck
          cards={currentSession?.chancellorPolicies}
          center={true}
          expanded={!isPresident && !isChancellor}
          interactive={isPresident || isChancellor}
          selectable={true}
        />
      </div>
      {#if isPresident}
        <div>
          <PlayfulButton
            on:click={() => {
              dispatch("answer", false)
              open = false
            }}
            size="small"
          >
            Reject
          </PlayfulButton>
          <PlayfulButton
            on:click={() => {
              dispatch("answer", true)
              open = false
            }}
            size="small"
          >
            Accept veto
          </PlayfulButton>
        </div>
      {:else}
        <span class="text-sm text-center text-neutral-400">
          Waiting for the President's decision...
        </span>
      {/if}
    </div>
  </div>
</FloatingWindow>
