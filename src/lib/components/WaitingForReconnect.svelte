<script lang="ts">
  import Icon from "@iconify/svelte"
  import { onDestroy } from "svelte"
  import { quartOut } from "svelte/easing"
  import { fly } from "svelte/transition"

  import { browser } from "$app/environment"
  import type { Player } from "$lib/player"

  /** The players the game is waiting on. Those offline for longer than the grace period are shown. */
  export let players: Player[] = []
  /** Ignores short drops, such as a page reload or a network switch. */
  export let gracePeriodMs: number = 5000

  const offlineSince: Map<string, number> = new Map()
  let now: number = Date.now()
  let ticker: ReturnType<typeof setInterval> | undefined

  $: offlinePlayers = players.filter((player) => !player.self && !player.isConnected)
  $: if (browser) trackOffline(offlinePlayers)
  $: shownPlayers = offlinePlayers.filter(
    (player) => now - (offlineSince.get(player.id) ?? now) >= gracePeriodMs,
  )

  function trackOffline(offlinePlayers: Player[]) {
    const offlineIds: Set<string> = new Set(offlinePlayers.map((player) => player.id))
    for (const id of offlineSince.keys()) {
      if (!offlineIds.has(id)) offlineSince.delete(id)
    }
    for (const id of offlineIds) {
      if (!offlineSince.has(id)) offlineSince.set(id, Date.now())
    }
    now = Date.now()

    if (offlineIds.size > 0 && ticker === undefined) {
      ticker = setInterval(() => (now = Date.now()), 1000)
    } else if (offlineIds.size === 0 && ticker !== undefined) {
      clearInterval(ticker)
      ticker = undefined
    }
  }

  function waitingText(players: Player[]): string {
    const who: string =
      players.length <= 2
        ? players.map((player) => player.name).join(" and ")
        : `${players.length} players`
    return `Waiting for ${who} to reconnect…`
  }

  onDestroy(() => clearInterval(ticker))
</script>

{#if shownPlayers.length > 0}
  <div
    class="pointer-events-none absolute inset-x-6 top-20 md:top-6 z-max flex justify-center"
    role="status"
    transition:fly={{ y: -20, duration: 300, easing: quartOut }}
  >
    <div
      class="flex items-center gap-3 px-4 py-2 shadow-frame bg-[#141414] border-2 border-sh-yellow-500 rounded-lg"
    >
      <Icon class="text-xl animate-[rotator_1.4s_step-end_infinite]" icon="fa:spinner" />
      <span>{waitingText(shownPlayers)}</span>
    </div>
  </div>
{/if}
