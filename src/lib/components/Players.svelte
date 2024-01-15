<script lang="ts">
  import PlayerView from "$lib/components/PlayerView.svelte"
  import { Compact } from "$lib/enums"
  import type { Player } from "$lib/player"
  import { createEventDispatcher } from "svelte"

  export let cols: number = 5
  export let compact: Compact = Compact.always
  export let fillRemaining: boolean = false
  export let highlight: boolean = false
  export let highlightPlayer: string | undefined = undefined
  export let players: Player[] | undefined
  export let showRoles: string[] | undefined = undefined
  export let showSelf: boolean = true
  export let showTitle: boolean = false

  const dispatch = createEventDispatcher()

  /// Essentials are:
  /// - Placards
  /// - Votes
  export let hidePlacards: boolean = false
  export let hideVotes: boolean = false

  /// Extras are:
  /// - Cards
  /// - Who's being investigated
  export let hideExtras: boolean = false

  export let hideName: boolean = false

  $: renderedPlayers = [
    ...(players ?? []),
    ...(fillRemaining
      ? Array(10 - (players?.length ?? 0)).fill({
          name: "...",
          isDummy: true,
        })
      : []),
  ].filter((player: Player) => showSelf || !player.self)
</script>

<div
  class="w-full flex flex-col items-center"
  class:gap-y-4={compact === Compact.always || compact === Compact.mobile}
  class:md:gap-y-4={compact === Compact.desktop}
  class:gap-y-7={compact === Compact.never || compact === Compact.desktop}
  class:md:gap-y-7={compact === Compact.mobile || compact === Compact.desktop}
>
  {#if showTitle}
    <span>Players {players?.length ?? 0}/10</span>
  {/if}

  <div
    class="w-full grid gap-x-6 text-sm"
    class:gap-y-3={compact === Compact.always || compact === Compact.mobile}
    class:md:gap-y-3={compact === Compact.desktop}
    class:gap-y-7={compact === Compact.never || compact === Compact.desktop}
    class:md:gap-y-7={compact === Compact.mobile || compact === Compact.desktop}
    style:grid-template-columns="repeat({cols}, minmax(0, 1fr))"
  >
    {#each renderedPlayers as player}
      <PlayerView
        {player}
        {hideExtras}
        {hideName}
        {hidePlacards}
        {hideVotes}
        highlight={highlight || highlightPlayer === player.id}
        on:click={() => dispatch("click", player)}
        showRole={showRoles?.includes(player.id) ?? false}
      />
    {/each}
  </div>
</div>
