<script lang="ts">
  import { createEventDispatcher } from "svelte"

  import FloatingWindow from "$lib/components/FloatingWindow.svelte"
  import PlayfulButton from "$lib/components/PlayfulButton.svelte"
  import PlayerView from "$lib/components/PlayerView.svelte"
  import type { GameDataSession } from "$lib/game_data"
  import Deck from "$lib/components/Deck.svelte"

  export let currentSession: GameDataSession | undefined = undefined
  export let open: boolean
  export let visiblePlayerIds: string[] | undefined = undefined

  const dispatch = createEventDispatcher()

  let selectedPolicy: string | undefined
</script>

<FloatingWindow allowDismiss={false} bind:open classes="w-full md:w-fit px-4">
  <div
    class="flex flex-col md:flex-row items-center px-6 md:px-16 py-8 shadow-frame bg-[#141414] rounded-lg gap-10 md:gap-32"
  >
    {#if currentSession.presidentId !== undefined && currentSession.chancellorId !== undefined}
      <div class="flex flex-col items-center gap-4 md:gap-10">
        <span class="text-2xl font-futura">Your Government</span>
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
      <span class="text-center">Swipe and choose 1 policy to discard</span>
      <div class="w-60 h-60 mb-10">
        <Deck
          cards={currentSession?.chancellorPolicies}
          center={true}
          interactive={true}
          on:select={({ detail }) => (selectedPolicy = detail)}
          selectable={true}
        />
      </div>
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
      <span class="text-sm text-center text-neutral-400">
        <iconify-icon class="align-[-0.14rem]" icon="fa:info-circle" />&nbsp;&nbsp;The President
        handed you 2&nbsp;policies,<br />you have to discard one and enact the other
      </span>
    </div>
  </div>
</FloatingWindow>
