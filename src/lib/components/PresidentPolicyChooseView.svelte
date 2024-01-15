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
    class="md:w-screen md:max-w-4xl flex flex-col md:flex-row justify-center items-center px-6 md:px-16 py-8 shadow-frame bg-[#141414] rounded-lg gap-10 md:gap-48"
  >
    {#if currentSession?.presidentId !== undefined && currentSession?.chancellorId !== undefined}
      <div class="flex flex-col items-center gap-4 md:gap-10">
        <span class="text-2xl font-futura">Your Government</span>
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
        <span>Swipe and choose 1 policy to discard</span>
        <br />
        <span class="text-sm text-white text-opacity-60">The remaining 2 will go to your Chancellor</span>
      </p>
      <div class="w-60 h-60 mb-10">
        <Deck
          cards={currentSession?.presidentPolicies}
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
        <iconify-icon class="align-[-0.14rem]" icon="fa:info-circle" />&nbsp;&nbsp;Next, your Chancellor will <br /> choose which policy to enact
      </span>
    </div>
  </div>
</FloatingWindow>
