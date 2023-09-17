<script lang="ts">
  import PlayerView from "$lib/components/PlayerView.svelte"
  import type { Player } from "$lib/player"

  export let fillRemaining = false
  export let players: Player[] | undefined
  export let showSelf = true
  export let showTitle = false

  /// Essentials are:
  /// - Placards
  /// - Votes
  export let hideEssentials = false

  /// Extras are:
  /// - Cards
  /// - Who's being investigated
  export let hideExtras = false

  export let hideName = false

  export let showRoles = false

  $: renderedPlayers = [
    ...(players ?? []),
    ...(fillRemaining
      ? Array(5 - (players?.length ?? 0)).fill({
          name: "...",
          isDummy: true,
        })
      : []),
  ].filter((player: Player) => showSelf || !player.self)
</script>

<div class="w-full flex flex-col items-center gap-4 text-sm">
  {#if showTitle}
    <span>Players {players?.length ?? 0}/10</span>
  {/if}

  <div class="w-full grid grid-cols-5 gap-x-5 gap-y-2">
    {#each renderedPlayers as player}
      <PlayerView {player} {hideEssentials} {hideExtras} {hideName} showRole={showRoles} />
    {/each}
  </div>
</div>
