<script lang="ts">
  import PaperBack from "$lib/components/PaperBack.svelte"
  import type { Player } from "$lib/player"

  export let player: Player | undefined
</script>

<PaperBack
  classes="w-full"
  contentClasses="flex justify-center gap-6 px-10 py-2"
  backgroundColor={player?.role === "liberal" ? "#0091b3" : "#d60d00"}
>
  <div class="flex">
    <div
      class="z-10 rounded-sm h-10 aspect-[397/555] bg-contain bg-center -rotate-[15deg]"
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
      class="rounded-sm h-10 aspect-[397/555] bg-contain bg-center rotate-[15deg] -ml-3"
      class:bg-card-membership-liberal={player?.membership === "liberal"}
      class:bg-card-membership-fascist={player?.membership === "fascist"}
    />
  </div>
  <div class="flex flex-col">
    <h3 class="font-eskapade_fraktur text-4xl uppercase">{player?.role}</h3>
  </div>
</PaperBack>
