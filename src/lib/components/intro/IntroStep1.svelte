<script lang="ts">
  import type { Player } from "$lib/player"

  export let player: Player | undefined
</script>

<div class="flex flex-col">
  <span class="font-futura text-lg uppercase tracking-widest">Your secret role</span>
  <h3 class="font-eskapade_fraktur text-6xl uppercase">{player?.role}</h3>
</div>

<div class="w-full px-16">
  <div
    class="w-full aspect-square bg-player-hitler bg-contain bg-center rounded-full border-[6px] border-[#f7e1c1]"
    class:bg-player-fascist-frog={player?.assetReference === "fascist_frog"}
    class:bg-player-fascist-lizard={player?.assetReference === "fascist_lizard"}
    class:bg-player-fascist-snake={player?.assetReference === "fascist_snake"}
    class:bg-player-hitler={player?.assetReference === "hitler"}
    class:bg-player-liberal-1={player?.assetReference === "liberal_1"}
    class:bg-player-liberal-2={player?.assetReference === "liberal_2"}
    class:bg-player-liberal-3={player?.assetReference === "liberal_3"}
    class:bg-player-liberal-4={player?.assetReference === "liberal_4"}
    class:bg-player-liberal-5={player?.assetReference === "liberal_5"}
    class:bg-player-liberal-6={player?.assetReference === "liberal_6"}
  />
</div>

<div class="w-full text-center px-10">
  {#if player?.role === "liberal"}
    You have a majority, but you don't know for sure who anyone is.
  {:else}
    You must resort to secrecy and sabotage to accomplish your goals.
  {/if}
</div>
