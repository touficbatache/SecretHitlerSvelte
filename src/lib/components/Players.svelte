<script lang="ts">
  import PlayerView from "$lib/components/PlayerView.svelte"
  import { Compact } from "$lib/enums"
  import type { Player } from "$lib/player"

  type ShowRoles = "all" | "fascist" | "liberal" | "none"

  export let compact: Compact = Compact.always
  export let fillRemaining: boolean = false
  export let players: Player[] | undefined
  export let showSelf: boolean = true
  export let showTitle: boolean = false

  /// Essentials are:
  /// - Placards
  /// - Votes
  export let hideEssentials: boolean = false

  /// Extras are:
  /// - Cards
  /// - Who's being investigated
  export let hideExtras: boolean = false

  export let hideName: boolean = false

  export let showRoles: ShowRoles = "none"

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

<div class="w-full flex flex-col items-center gap-4">
  {#if showTitle}
    <span>Players {players?.length ?? 0}/10</span>
  {/if}

  <div
    class="w-full grid grid-cols-5 gap-x-5 text-sm"
    class:gap-y-2={compact === Compact.always || compact === Compact.mobile}
    class:md:gap-y-2={compact === Compact.desktop}
    class:gap-y-5={compact === Compact.never || compact === Compact.desktop}
    class:md:gap-y-5={compact === Compact.mobile || compact === Compact.desktop}
  >
    {#each renderedPlayers as player}
      <PlayerView
        {player}
        {hideEssentials}
        {hideExtras}
        {hideName}
        showRole={showRoles === "all" ||
          (showRoles === "fascist" && player.membership === "fascist") ||
          (showRoles === "liberal" && player.membership === "liberal")}
      />
    {/each}
  </div>
</div>
