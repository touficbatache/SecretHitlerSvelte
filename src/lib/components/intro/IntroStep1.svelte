<script lang="ts">
  import type { Player } from "$lib/player"

  export let player: Player | undefined
</script>

<div class="flex flex-col">
  <span class="font-futura text-lg uppercase tracking-widest">Your secret role</span>
  <h3 class="font-eskapade_fraktur text-6xl uppercase">{player?.role}</h3>
</div>

<!--<div class="ani" />-->

<!--<div class="anim" />-->

<!--<div class="group animate-[cs-pos_3s_300ms]">-->
<!--  <div class="flex">-->
<!--    <div-->
<!--      class="animate-[cs-siz-reverse_3s_300ms_forwards] relative z-30 rounded-md h-48 aspect-[397/555] bg-contain bg-center transition-all -rotate-[15deg] group-hover:rotate-0 group-hover:ml-0"-->
<!--      style="transform-style: preserve-3d; transform: rotateY(180deg)"-->
<!--      class:bg-card-role-fascist-frog={player?.assetReference === "fascist_frog"}-->
<!--      class:bg-card-role-fascist-lizard={player?.assetReference === "fascist_lizard"}-->
<!--      class:bg-card-role-fascist-snake={player?.assetReference === "fascist_snake"}-->
<!--      class:bg-card-role-hitler={player?.assetReference === "hitler"}-->
<!--      class:bg-card-role-liberal-1={player?.assetReference === "liberal_1"}-->
<!--      class:bg-card-role-liberal-2={player?.assetReference === "liberal_2"}-->
<!--      class:bg-card-role-liberal-3={player?.assetReference === "liberal_3"}-->
<!--      class:bg-card-role-liberal-4={player?.assetReference === "liberal_4"}-->
<!--      class:bg-card-role-liberal-5={player?.assetReference === "liberal_5"}-->
<!--      class:bg-card-role-liberal-6={player?.assetReference === "liberal_6"}-->
<!--    >-->
<!--      <div-->
<!--        class="absolute inset-0 w-full h-full bg-card-role-backcover bg-contain bg-center rounded-md"-->
<!--        style="transform: rotateY(180deg); transform-origin: 50% 0 -0.5px;"-->
<!--      />-->
<!--    </div>-->
<!--    <div-->
<!--      class="animate-[cs-siz_3s_300ms] z-20 rounded-md h-48 aspect-[397/555] bg-contain bg-center -ml-16 transition-all rotate-[15deg] group-hover:rotate-0 group-hover:ml-10"-->
<!--      class:bg-card-membership-liberal={player?.membership === "liberal"}-->
<!--      class:bg-card-membership-fascist={player?.membership === "fascist"}-->
<!--    />-->
<!--  </div>-->
<!--</div>-->

<div class="animate-[grow-reveal_3s_300ms_forwards]">
  <!--  animate-[rotate-reveal_3s_300ms_forwards]-->
  <div
    class="animate-[rotate-reveal_3s_300ms_forwards] relative z-30 rounded-md h-48 aspect-[397/555] bg-contain bg-center transition-all -rotate-[15deg] group-hover:rotate-0 group-hover:ml-0"
    style="transform-style: preserve-3d; transform: rotateY(180deg)"
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
  >
    <div
      class="absolute inset-0 w-full h-full bg-card-role-backcover bg-contain bg-center rounded-md"
      style="transform: rotateY(180deg); transform-origin: 50% 0 -0.5px;"
    />
  </div>
</div>

<div class="relative w-full h-32">
  <div class="absolute top-1/2 -translate-y-1/2 text-center">
    {#if player?.role === "liberal"}
      You have a majority, but you don't know for sure who anyone is.
    {:else}
      You must resort to secrecy and sabotage to accomplish your goals.
    {/if}
  </div>
</div>

<style>
  @keyframes cs-pos {
    0% {
      transform: translateX(0);
    }
    10% {
      animation-timing-function: ease-in;
      transform: translateX(-100px);
    }
    80% {
      animation-timing-function: ease-out;
      transform: translateX(100px);
    }
  }
  @keyframes cs-siz {
    0% {
      transform: scale(1) rotateY(0deg);
    }
    30%,
    70% {
      transform: scale(2) rotateY(180deg);
    }
  }

  .ani {
    animation: cs-pos 3s;
  }
  .ani::after {
    content: "";
    display: block;
    width: 100px;
    height: 140px;
    background-image: url("/policy_fascist.png");
    background-size: cover;
    animation: cs-siz 3s;
  }
  .ani1 {
    animation: cs-pos 3s;
  }
  .ani2 {
    animation: cs-siz 3s;
  }
  .anim::after {
    content: "";
    display: block;
    width: 100px;
    height: 140px;
    background-image: url("/policy_fascist.png");
    background-size: cover;
    /*animation: cs-siz 3s;*/
  }

  /*"card-showcase": {*/
  /*"0%, 100%": {*/
  /*"animation-timing-function": "linear",*/
  /*transform: "translateX(0) scale(1)",*/
  /*},*/
  /*"5%": {*/
  /*"animation-timing-function": "cubic-bezier(.73,.03,.99,.55)",*/
  /*transform: "translateX(-60px) scale(1)",*/
  /*},*/
  /*"10%": {*/
  /*"animation-timing-function": "cubic-bezier(.73,.03,.99,.55)",*/
  /*transform: "translateX(-100px) scale(1.5)",*/
  /*},*/
  /*"15%": {*/
  /*"animation-timing-function": "cubic-bezier(.73,.03,.99,.55)",*/
  /*transform: "translateX(-60px) scale(2)",*/
  /*},*/
  /*"85%": {*/
  /*"animation-timing-function": "linear",*/
  /*transform: "translateX(80px) scale(2)",*/
  /*},*/
  /*"90%": {*/
  /*"animation-timing-function": "linear",*/
  /*transform: "translateX(100px) scale(1.5)",*/
  /*},*/
  /*"95%": {*/
  /*"animation-timing-function": "linear",*/
  /*transform: "translateX(80px) scale(1)",*/
  /*},*/
  /*},*/
</style>
