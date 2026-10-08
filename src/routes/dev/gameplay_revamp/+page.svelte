<script lang="ts">
  import { Canvas } from "@threlte/core"

  import GameplayScene from "$lib/components/GameplayScene.svelte"
  import type { GameDataPolicies } from "$lib/game_data"

  const dummyPolicies: GameDataPolicies = {
    board: { liberal: 2, fascist: 3 },
    drawPile: [
      "fascist",
      "liberal",
      "fascist",
      "liberal",
      "fascist",
      "liberal",
      "fascist",
      "fascist",
      "liberal",
    ],
    drawPileCount: () => 9,
    discardPile: { liberal: 1, fascist: 2 },
    discardPileCount: () => 3,
  }
</script>

<Canvas>
  <!--  <Theatre>-->
  <GameplayScene
    policies={{
      ...dummyPolicies,
      drawPile: dummyPolicies.drawPile.toReversed(),
    }}
  />
  <!--  </Theatre>-->
</Canvas>
