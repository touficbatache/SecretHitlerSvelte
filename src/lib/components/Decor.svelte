<script lang="ts">
  import * as ApiClient from "$lib/api_client"
  import { clickOutside } from "$lib/click_outside"
  import PinInput from "$lib/components/PinInput.svelte"
  import Players from "$lib/components/Players.svelte"
  import PlayerView from "$lib/components/PlayerView.svelte"
  import type { GameData } from "$lib/game_data"

  export let gameCode: string
  export let gameData: GameData | undefined

  let btnInfo: HTMLElement
  let showInfo = false
</script>

{#if gameData?.players}
  <div class="w-full h-full flex flex-col justify-between">
    <Players
      players={gameData?.players?.others}
      showRoles={gameData?.players?.self?.membership === "fascist" ? "fascist" : "none"}
    />

    <slot />

    <div class="w-full flex justify-around">
      {#if showInfo && btnInfo !== undefined}
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-full px-10 md:px-0"
          use:clickOutside={{ callback: () => (showInfo = false), excluded: [btnInfo] }}
        >
          <div class="py-4 flex flex-col bg-[#424242] shadow-2xl shadow-white/10 rounded-lg">
            <span class="w-full text-center">Game info</span>

            <div class="flex flex-col gap-8 mt-4 px-6">
              <PinInput
                isEnabled={false}
                inactiveClass="bg-button-500 text-sh-yellow-500"
                activeClass="bg-sh-yellow-500 bg-opacity-70 text-sh-yellow-500 border-2 border-sh-yellow-500 border-opacity-70"
                pin={gameCode}
              />

              <div class="flex flex-col gap-2">
                <span>
                  {gameData?.players?.fascists.length} fascists
                </span>
                <Players
                  players={gameData?.players?.fascists.sort(() => Math.random() - 0.5)}
                  hideEssentials={true}
                  hideExtras={true}
                  hideName={true}
                  showRoles={!gameData?.settings.hidePicsGameInfo ? "all" : "none"}
                />
              </div>

              <div class="flex flex-col gap-2">
                <span>
                  {gameData?.players?.liberals.length} liberals
                </span>
                <Players
                  players={gameData?.players?.liberals.sort(() => Math.random() - 0.5)}
                  hideEssentials={true}
                  hideExtras={true}
                  hideName={true}
                  showRoles={!gameData?.settings.hidePicsGameInfo ? "all" : "none"}
                />
              </div>
            </div>
          </div>
        </div>
      {/if}

      <button
        bind:this={btnInfo}
        class="h-fit flex p-3 mt-1 rounded-full hover:bg-white hover:bg-opacity-10 active:bg-white active:bg-opacity-20 transition-all duration-100 ease-material-standard"
        on:click={() => (showInfo = !showInfo)}
      >
        <iconify-icon class="text-2xl" icon="material-symbols:info-outline" />
      </button>

      <!--      <PlayfulIconButton extraClasses="w-10 h-10" icon="fa:info" />-->

      <div class="w-1/5 px-2">
        <PlayerView player={gameData?.players?.self} showRole={true} revealCards={true} />
      </div>

      <button
        class="h-fit flex p-3 mt-1 rounded-full hover:bg-white hover:bg-opacity-10 active:bg-white active:bg-opacity-20 transition-all duration-100 ease-material-standard"
        on:click={ApiClient.leaveGame}
      >
        <iconify-icon class="text-2xl" icon="material-symbols:logout" />
      </button>
    </div>

    <!--    <div class="relative w-full">-->
    <!--      <img src="bottombar.png" class="invisible" />-->
    <!--      <div-->
    <!--        class="test"-->
    <!--        style="-->
    <!--          width: 100%;-->
    <!--          height: 58px;-->
    <!--          position: absolute;-->
    <!--          bottom: 0px;-->
    <!--          background: rgb(86 86 255);-->
    <!--          clip-path: polygon(5px 0, calc(100% - 5px) 0, 100% 5px, 100% calc(100% - 5px), calc(100% - 5px) 100%, 5px 100%, 0 calc(100% - 5px), 0 5px);-->
    <!--          /*box-shadow: rgb(255 255 255 / 63%) 0px 1px 5px 0px inset, rgb(0 0 0 / 17%) 0px 2px 20px 0px inset;*/-->
    <!--        "-->
    <!--      >-->
    <!--        <div-->
    <!--          style="-->
    <!--            position: absolute;-->
    <!--            top: 0;-->
    <!--            right: 0;-->
    <!--            width: 8px;-->
    <!--            height: 8px;-->
    <!--            clip-path: polygon(0 65%, 35% 0, 100% 65%, 35% 100%);-->
    <!--            background: rgb(108 108 255);-->
    <!--          "-->
    <!--        />-->
    <!--        <div-->
    <!--          style="-->
    <!--            position: absolute;-->
    <!--            top: 0;-->
    <!--            left: 0;-->
    <!--            width: 8px;-->
    <!--            height: 8px;-->
    <!--            clip-path: polygon(0 65%, 35% 0, 100% 65%, 35% 100%);-->
    <!--            background: rgb(108 108 255);-->
    <!--            transform: rotate(-90deg);-->
    <!--          "-->
    <!--        />-->
    <!--        <div-->
    <!--          style="-->
    <!--            position: absolute;-->
    <!--            bottom: 0;-->
    <!--            left: 0;-->
    <!--            width: 8px;-->
    <!--            height: 8px;-->
    <!--            clip-path: polygon(0 65%, 35% 0, 100% 65%, 35% 100%);-->
    <!--            background: rgb(108 108 255);-->
    <!--            transform: rotate(180deg);-->
    <!--          "-->
    <!--        />-->
    <!--        <div-->
    <!--          style="-->
    <!--            position: absolute;-->
    <!--            bottom: 0;-->
    <!--            right: 0;-->
    <!--            width: 8px;-->
    <!--            height: 8px;-->
    <!--            clip-path: polygon(0 65%, 35% 0, 100% 65%, 35% 100%);-->
    <!--            background: rgb(108 108 255);-->
    <!--            transform: rotate(90deg);-->
    <!--          "-->
    <!--        />-->
    <!--      </div>-->

    <!--      &lt;!&ndash;      <div&ndash;&gt;-->
    <!--      &lt;!&ndash;        style="&ndash;&gt;-->
    <!--      &lt;!&ndash;          opacity: 0.4;&ndash;&gt;-->
    <!--      &lt;!&ndash;          width: 100%;&ndash;&gt;-->
    <!--      &lt;!&ndash;          height: 58px;&ndash;&gt;-->
    <!--      &lt;!&ndash;          position: absolute;&ndash;&gt;-->
    <!--      &lt;!&ndash;          bottom: 0px;&ndash;&gt;-->
    <!--      &lt;!&ndash;          background: rgb(0, 0, 255);&ndash;&gt;-->
    <!--      &lt;!&ndash;          border-top-left-radius: 10px;&ndash;&gt;-->
    <!--      &lt;!&ndash;          border-top-right-radius: 10px;&ndash;&gt;-->
    <!--      &lt;!&ndash;          box-shadow: rgb(255 255 255 / 63%) 0px 1px 5px 0px inset, rgb(0 0 0 / 17%) 0px 2px 20px 0px inset;&ndash;&gt;-->
    <!--      &lt;!&ndash;        "&ndash;&gt;-->
    <!--      &lt;!&ndash;      />&ndash;&gt;-->
    <!--    </div>-->
  </div>
{/if}

<style>
  .test:before {
    content: "";
    position: absolute;
    top: 5px;
    right: 5px;
    bottom: 5px;
    left: 5px;
    background: rgb(81 81 255);
    box-shadow: inset 0px 7px 9px 1px #0000001a;
    clip-path: polygon(
      3px 0px,
      calc(100% - 3px) 0px,
      100% 3px,
      100% calc(100% - 3px),
      calc(100% - 3px) 100%,
      3px 100%,
      0px calc(100% - 3px),
      0px 3px
    );
  }
</style>
