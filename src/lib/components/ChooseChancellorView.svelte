<script lang="ts">
  import FloatingWindow from "$lib/components/FloatingWindow.svelte"
  import Players from "$lib/components/Players.svelte"
  import type { Player } from "$lib/player"

  export let open: boolean
  export let players: Player[]
  export let showRoles: boolean
</script>

<FloatingWindow bind:isOpen={open} allowDismiss={false}>
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-4">
    <div class="flex flex-col items-center px-4 py-12 shadow-frame bg-[#141414] rounded-lg gap-4">
      <h5 class="text-3xl font-eskapade_fraktur">You're the President</h5>
      <span>Choose your Chancellor</span>
      <Players {players} {showRoles} />
    </div>
  </div>
</FloatingWindow>
