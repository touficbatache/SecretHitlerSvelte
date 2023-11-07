<script lang="ts">
  import type { Player } from "$lib/player"

  interface CustomPlayer extends Player {
    isDummy: boolean
  }

  export let player: CustomPlayer | undefined

  /// Essentials are:
  /// - Placards
  /// - Votes
  export let hideEssentials = false

  /// Extras are:
  /// - Cards
  /// - Who's being investigated
  export let hideExtras = false

  export let hideName = false

  export let showRole = false

  export let revealCards = false
</script>

<div class="flex flex-col items-center gap-0.5" class:opacity-30={player?.isDummy}>
  <div class="relative w-full aspect-square">
    <div
      class="z-50 absolute w-full aspect-square bg-contain bg-center rounded-full"
      class:bg-player={!showRole}
      class:bg-player-fascist-frog={showRole && player?.assetReference === "fascist_frog"}
      class:bg-player-fascist-lizard={showRole && player?.assetReference === "fascist_lizard"}
      class:bg-player-fascist-snake={showRole && player?.assetReference === "fascist_snake"}
      class:bg-player-hitler={showRole && player?.assetReference === "hitler"}
      class:bg-player-liberal-1={showRole && player?.assetReference === "liberal_1"}
      class:bg-player-liberal-2={showRole && player?.assetReference === "liberal_2"}
      class:bg-player-liberal-3={showRole && player?.assetReference === "liberal_3"}
      class:bg-player-liberal-4={showRole && player?.assetReference === "liberal_4"}
      class:bg-player-liberal-5={showRole && player?.assetReference === "liberal_5"}
      class:bg-player-liberal-6={showRole && player?.assetReference === "liberal_6"}
    />
    {#if !hideEssentials}
      <div
        class="z-50 absolute bottom-0 w-full aspect-[1321/349] bg-contain bg-center"
        class:bg-placard-president={player?.isPresident}
        class:bg-placard-chancellor={player?.isChancellor || player?.isPreviousChancellor}
      />
    {/if}
    {#if !hideExtras}
      {#if revealCards}
        <div class="absolute -top-2.5 left-0 right-0 flex justify-center">
          <div
            class="z-40 rounded-sm h-6 aspect-[397/555] bg-contain bg-center -rotate-45"
            class:bg-card-role-fascist-frog={player?.assetReference === "fascist_frog"}
            class:bg-card-role-fascist-lizard={player?.assetReference === "fascist_lizard"}
            class:bg-card-role-fascist-snake={player?.assetReference === "fascist_snake"}
            class:bg-card-role-hitler={player?.assetReference === "hitler"}
            class:bg-card-role-liberal-1={player?.assetReference === "liberal_1"}
            class:bg-card-role-liberal-2={player?.assetReference === "liberal_2"}
            class:bg-card-role-liberal-3={player?.assetReference === "liberal_3"}
            class:bg-card-role-liberal-4={player?.assetReference === "liberal_4"}
            class:bg-card-role-liberal-5={player?.assetReference === "liberal_5"}
            class:bg-card-role-liberal-6={player?.assetReference === "liberal_6"}
          />
          <div
            class="z-30 rounded-sm h-6 aspect-[397/555] bg-contain bg-center -rotate-[15deg] -ml-2.5 -mt-1"
            class:bg-card-membership-liberal={player?.membership === "liberal"}
            class:bg-card-membership-fascist={player?.membership === "fascist"}
          />
          <div
            class="z-20 rounded-sm h-6 aspect-[397/555] bg-card-ballot-ja bg-contain bg-center rotate-[15deg] -ml-2 -mt-1"
          />
          <div
            class="z-10 rounded-sm h-6 aspect-[397/555] bg-card-ballot-nein bg-contain bg-center rotate-45 -ml-2.5"
          />
        </div>
      {:else}
        <div class="absolute -bottom-[0.8rem] left-0 right-0 flex justify-center">
          <div
            class="z-40 rounded-sm h-6 aspect-[397/555] bg-card-role-backcover bg-contain bg-center -rotate-[135deg]"
          />
          <div
            class="z-30 rounded-sm h-6 aspect-[397/555] bg-card-membership-backcover bg-contain bg-center -rotate-[165deg] -ml-2.5 mt-1"
          />
          <div
            class="z-20 rounded-sm h-6 aspect-[397/555] bg-card-ballot-backcover bg-contain bg-center rotate-[165deg] -ml-2 mt-1"
          />
          <div
            class="z-10 rounded-sm h-6 aspect-[397/555] bg-card-ballot-backcover bg-contain bg-center rotate-[135deg] -ml-2.5"
          />
        </div>
      {/if}
    {/if}
  </div>
  {#if !hideName}
    <span class:mt-5={!hideExtras && !revealCards}>{player?.name}</span>
  {/if}
</div>
