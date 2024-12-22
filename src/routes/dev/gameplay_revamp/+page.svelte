<script lang="ts">
  import { Canvas } from "@threlte/core"

  import GameplayScene from "$lib/components/GameplayScene.svelte"
</script>

<Canvas>
  <!--  <Theatre>-->
  <GameplayScene
    policies={{
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
      discardPileCount: () => 3,
    }}
  />
  <!--  </Theatre>-->
</Canvas>
