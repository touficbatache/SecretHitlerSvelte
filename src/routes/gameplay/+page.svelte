<script lang="ts">
  import { getContext } from "svelte"
  import type { Writable } from "svelte/store"

  import { browser } from "$app/environment"
  import { goto } from "$app/navigation"
  import { page } from "$app/stores"
  import Decor from "$lib/components/Decor.svelte"
  import type { GameData } from "$lib/game_data"

  const gameCode = $page.data.gameCode
  const gameData = getContext("gameData") as Writable<GameData>

  $: if (browser) {
    if ($page.data.gameCode === undefined) {
      goto("/")
    }
  }

  $: console.log($gameData)
</script>

<div class="w-full h-full px-6 py-4">
  <Decor {gameCode} gameData={$gameData}>
    <div class="w-full aspect-[1547/551] bg-board-liberal bg-cover rounded shadow-depth">
      <!--      -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;-->
      <!--      <br />-->
      <!--      -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;-->
      <!--      <br />-->
      <!--      -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;-->
      <!--      <br />-->
      <!--      -&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;&#45;-->
    </div>

    {#if $gameData?.players}
      {@const playerCount = $gameData?.players.length}
      <div
        class="w-full aspect-[1547/551] bg-cover rounded shadow-depth"
        class:bg-board-fascist-5-6={playerCount === 5 || playerCount === 6}
        class:bg-board-fascist-7-8={playerCount === 7 || playerCount === 8}
        class:bg-board-fascist-9-10={playerCount === 9 || playerCount === 10}
      />
    {/if}
  </Decor>
</div>
