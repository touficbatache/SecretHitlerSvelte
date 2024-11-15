<script lang="ts">
  import * as ApiClient from "$lib/api_client"
  import FloatingWindow from "$lib/components/FloatingWindow.svelte"
  import Players from "$lib/components/Players.svelte"
  import PlayfulButton from "$lib/components/PlayfulButton.svelte"
  import type { GameDataPlayers } from "$lib/game_data"
  import type { PlayerMembership } from "$lib/player"

  export let open: boolean
  export let players: GameDataPlayers | undefined
  export let winningTeam: PlayerMembership | undefined
</script>

<FloatingWindow
  allowDismiss={false}
  bind:open
  classes="w-full md:w-auto md:h-full flex flex-col px-4 md:py-4 md:flex md:items-center"
>
  {#if winningTeam === "fascist"}
    <div class="relative px-20">
      <div
        class="aspect-[1535/1986] bg-illustration-fascist bg-cover drop-shadow-[0_0_50px_rgba(214,13,0,0.7)]"
      />
    </div>
    <div class="flex flex-col gap-4 -mt-10 px-4 pb-6 pt-14 shadow-frame bg-[#141414] rounded-lg">
      <div class="flex flex-col items-center">
        <h3 class="font-eskapade_fraktur text-6xl uppercase">Fascists</h3>
        <span class="font-futura text-lg uppercase tracking-widest">won the game</span>
      </div>
      <Players
        cols={Math.min(players?.fascists.length ?? 0, 4)}
        hideExtras={true}
        hidePlacards={true}
        hideVotes={true}
        highlightPlayer={players?.self.id}
        players={players?.fascists}
        showRoles={players?.fascists.map((p) => p.id)}
      />
    </div>
    <div class="flex items-center gap-4 py-5">
      <div class="flex-1 h-0.5 bg-neutral-50/30" />
      <h3 class="font-futura text-lg uppercase tracking-widest">vs</h3>
      <div class="flex-1 h-0.5 bg-neutral-50/30" />
    </div>
    <div class="flex flex-col gap-4 p-6 shadow-frame bg-[#141414] rounded-lg">
      <Players
        cols={4}
        hideExtras={true}
        hidePlacards={true}
        hideVotes={true}
        highlightPlayer={players?.self.id}
        players={players?.liberals}
        showRoles={players?.liberals.map((p) => p.id)}
      />
    </div>
  {:else if winningTeam === "liberal"}
    <div class="px-24">
      <div
        class="aspect-square bg-illustration-liberal bg-cover bg-center drop-shadow-[0_0_50px_rgba(0,145,179,0.7)] shadow-blue-liberal/30"
      />
    </div>
    <div class="flex flex-col gap-4 -mt-16 px-6 pb-6 pt-20 shadow-frame bg-[#141414] rounded-lg">
      <div class="flex flex-col items-center">
        <h3 class="font-eskapade_fraktur text-6xl uppercase">Liberals</h3>
        <span class="font-futura text-lg uppercase tracking-widest">won the game</span>
      </div>
      <Players
        cols={Math.min(players?.liberals.length ?? 0, 4)}
        hideExtras={true}
        hidePlacards={true}
        hideVotes={true}
        highlightPlayer={players?.self.id}
        players={players?.liberals}
        showRoles={players?.liberals.map((p) => p.id)}
      />
    </div>
    <div class="flex items-center gap-4 py-5">
      <div class="flex-1 h-0.5 bg-neutral-50/30" />
      <h3 class="font-futura text-lg uppercase tracking-widest">vs</h3>
      <div class="flex-1 h-0.5 bg-neutral-50/30" />
    </div>
    <div class="flex flex-col gap-4 p-6 shadow-frame bg-[#141414] rounded-lg">
      <Players
        cols={4}
        hideExtras={true}
        hidePlacards={true}
        hideVotes={true}
        highlightPlayer={players?.self.id}
        players={players?.fascists}
        showRoles={players?.fascists.map((p) => p.id)}
      />
    </div>
  {/if}
  <div class="w-full flex justify-center py-4">
    <PlayfulButton on:click={ApiClient.leaveGame} size="small">Leave</PlayfulButton>
  </div>
</FloatingWindow>
