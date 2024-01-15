<script lang="ts">
  import { getContext } from "svelte"
  import type { Readable } from "svelte/store"

  import { browser } from "$app/environment"
  import { goto } from "$app/navigation"
  import { page } from "$app/stores"
  import * as ApiClient from "$lib/api_client"
  import ChooseChancellorView from "$lib/components/ChooseChancellorView.svelte"
  import ChancellorPolicyChooseView from "$lib/components/ChancellorPolicyChooseView.svelte"
  import Deck from "$lib/components/Deck.svelte"
  import Decor from "$lib/components/Decor.svelte"
  import PresidentPolicyChooseView from "$lib/components/PresidentPolicyChooseView.svelte"
  import VoteView from "$lib/components/VoteView.svelte"
  import type { GameData } from "$lib/game_data"

  const gameCode: string = $page.data.gameCode
  const gameData: Readable<GameData | undefined> = getContext("gameData") as Readable<
    GameData | undefined
  >

  $: if (browser) {
    if ($page.data.gameCode === undefined) {
      goto("/")
    }

    if ($gameData?.status === "waiting") {
      goto("/waitingRoom")
    }

    if ($gameData?.status === "settingUp") {
      goto("/intro")
    }
  }

  $: liberalPolicyCount = $gameData?.policies.board?.liberal ?? 0

  $: boardLiberals = [
    ...Array(liberalPolicyCount).fill(true),
    ...Array(5 - liberalPolicyCount).fill(false),
  ]
  $: boardFascists = [
    ...Array($gameData?.policies.board?.fascist ?? 0).fill(true),
    ...Array(6 - ($gameData?.policies.board?.fascist ?? 0)).fill(false),
  ]
</script>

<div class="w-full h-full px-6 py-4">
  <Decor {gameCode} gameData={$gameData}>
    {#if $gameData?.players?.all}
      {@const playerCount = $gameData?.players.all?.length}
      <!--        <div class="w-full aspect-[2251/1772] relative overflow-hidden">-->
      <!--          <div-->
      <!--            class="absolute inset-0 z-10 pl-[4.5rem] py-[4.25rem] bg-[#61c8d8]">-->
      <!--            <div class="h-full aspect-[3174/852] bg-board-liberal-small-interior bg-cover" />-->
      <!--          </div>-->
      <!--          <div-->
      <!--            class="absolute inset-0 z-20 bg-board-liberal-small-exterior bg-cover rounded shadow-depth"-->
      <!--          />-->
      <!--        </div>-->

      <div class="flex flex-col md:hidden">
        <div class="relative w-full aspect-[2133/1654] overflow-hidden rounded shadow-depth">
          <div
            class="absolute inset-0 z-10 pl-[4.5rem] py-[3.9rem] bg-[#61c8d8] transition-all duration-1000 delay-500 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)]"
            class:ml-[-16.5%]={liberalPolicyCount === 1}
            class:ml-[-47.5%]={liberalPolicyCount === 2}
            class:ml-[-79%]={liberalPolicyCount === 3}
            class:ml-[-93.5%]={liberalPolicyCount >= 4}
          >
            <div class="h-full aspect-[3174/852] bg-board-liberal-small-interior bg-cover" />
            <div class="absolute inset-0 pl-[4.7rem] py-[4.3rem] flex items-center px-14 gap-[1.05rem]">
              {#each { length: liberalPolicyCount } as _, i}
                <div
                  class="h-full rounded-lg aspect-[7/10] bg-policy-liberal bg-contain bg-center"
                />
              {/each}
            </div>
          </div>
          <div class="absolute inset-0 z-20 bg-board-liberal-small-exterior bg-cover" />
        </div>

        <div class="w-full aspect-[66/10] bg-board-election-tracker bg-cover rounded shadow-depth mt-6" />

        <div class="relative w-full aspect-[2123/1654] overflow-hidden rounded shadow-depth mt-6">
          <div class="absolute inset-0 z-10 p-16 bg-[#e66443]">
            <div
              class="h-full aspect-[3831/873] bg-cover"
              class:bg-board-fascist-small-interior-56={playerCount === 5 || playerCount === 6}
              class:bg-board-fascist-small-interior-78={playerCount === 7 || playerCount === 8}
              class:bg-board-fascist-small-interior-910={playerCount === 9 || playerCount === 10}
            />
            <div class="absolute inset-0 pl-[4.5rem] py-[4.5rem] flex items-center px-14 gap-2.5">
              {#each { length: $gameData?.policies.board?.fascist ?? 0 } as _, i}
                <div
                  class="h-full rounded-lg aspect-[7/10] bg-policy-fascist bg-contain bg-center"
                />
              {/each}
            </div>
          </div>
          <div class="absolute inset-0 z-20 bg-board-fascist-small-exterior bg-cover" />
        </div>
      </div>

<!--      <div class="w-full h-full flex items-center gap-6">-->
<!--        <div class="flex-1 h-full py-16">-->
<!--          <div class="relative w-48 pl-[52px] pr-11 pt-12">-->
<!--            <div-->
<!--              class="w-full aspect-[7/10] bg-pile-draw bg-cover bg-center rounded shadow-depth"-->
<!--              style:transform="rotateX(45deg) rotateY(15deg) rotate(-45deg)"-->
<!--            />-->
<!--            <div class="absolute inset-0 aspect-square">-->
<!--              <Deck cards={$gameData?.policies.drawPile} center={true} shadow={false} />-->
<!--            </div>-->
<!--          </div>-->

<!--          &lt;!&ndash;          <div&ndash;&gt;-->
<!--          &lt;!&ndash;            class="relative"&ndash;&gt;-->
<!--          &lt;!&ndash;            style:transform="rotateX(45deg) rotateY(15deg) rotate(-45deg)"&ndash;&gt;-->
<!--          &lt;!&ndash;          >&ndash;&gt;-->
<!--          &lt;!&ndash;            <div&ndash;&gt;-->
<!--          &lt;!&ndash;              class="w-full aspect-[7/10] bg-pile-draw bg-cover bg-center rounded shadow-depth"&ndash;&gt;-->
<!--          &lt;!&ndash;            />&ndash;&gt;-->
<!--          &lt;!&ndash;            <div class="absolute inset-0 p-3">&ndash;&gt;-->
<!--          &lt;!&ndash;              <div&ndash;&gt;-->
<!--          &lt;!&ndash;                class="w-full aspect-[7/10] bg-policy-backcover bg-cover bg-center rounded"&ndash;&gt;-->
<!--          &lt;!&ndash;              />&ndash;&gt;-->
<!--          &lt;!&ndash;            </div>&ndash;&gt;-->
<!--          &lt;!&ndash;          </div>&ndash;&gt;-->
<!--        </div>-->
<!--        <div class="hidden flex-[7] md:flex flex-col gap-6">-->
<!--          <div class="w-full relative">-->
<!--            <div class="w-full aspect-[1547/551] bg-board-liberal bg-cover rounded shadow-depth" />-->
<!--            <div class="absolute inset-0 flex justify-between items-center px-[16.65%]">-->
<!--              {#each boardLiberals as show}-->
<!--                <div-->
<!--                  class="h-[48%] rounded-lg aspect-[7/10] bg-policy-liberal bg-contain bg-center"-->
<!--                  class:opacity-0={!show}-->
<!--                />-->
<!--              {/each}-->
<!--            </div>-->
<!--          </div>-->

<!--          <div class="w-full relative">-->
<!--            <div-->
<!--              class="w-full aspect-[14/5] bg-cover rounded shadow-depth"-->
<!--              class:bg-board-fascist-5-6={playerCount === 5 || playerCount === 6}-->
<!--              class:bg-board-fascist-7-8={playerCount === 7 || playerCount === 8}-->
<!--              class:bg-board-fascist-9-10={playerCount === 9 || playerCount === 10}-->
<!--            />-->
<!--            <div class="absolute inset-0 flex justify-between items-center pl-[9.7%] pr-[9.4%]">-->
<!--              {#each boardFascists as show}-->
<!--                <div-->
<!--                  class="h-[48%] rounded-lg aspect-[7/10] bg-policy-fascist bg-contain bg-center"-->
<!--                  class:opacity-0={!show}-->
<!--                />-->
<!--              {/each}-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="flex-1 h-full py-16">-->
<!--          <div-->
<!--            class="w-full aspect-[7/10] bg-pile-discard bg-cover bg-center rounded shadow-depth"-->
<!--            style:transform="rotateX(45deg) rotateY(15deg) rotate(-45deg)"-->
<!--          />-->
<!--        </div>-->
<!--      </div>-->
    {/if}
  </Decor>
</div>

<ChooseChancellorView
  on:click={({ detail }) => ApiClient.chooseChancellor(gameCode, detail)}
  open={$gameData?.subStatus === "election_presidentChoosingChancellor"}
  players={$gameData?.players}
  president={$gameData?.currentSession?.president()}
/>

<VoteView
  currentSession={$gameData?.currentSession}
  open={$gameData?.subStatus === "election_voting" ||
    $gameData?.subStatus === "election_votingEnded"}
  on:vote={({ detail }) => ApiClient.vote(gameCode, detail)}
  players={$gameData?.players}
  waiting={$gameData?.subStatus === "election_voting"}
/>

<PresidentPolicyChooseView
  currentSession={$gameData?.currentSession}
  on:click={({ detail }) => ApiClient.presidentDiscardPolicy(gameCode, detail)}
  open={$gameData?.subStatus === "legislativeSession_presidentDiscardingPolicy" &&
    $gameData?.players.self.isPresident}
  visiblePlayerIds={$gameData?.players.visiblePlayerIds()}
/>

<ChancellorPolicyChooseView
  currentSession={$gameData?.currentSession}
  on:click={({ detail }) => ApiClient.chancellorDiscardPolicy(gameCode, detail)}
  open={$gameData?.subStatus === "legislativeSession_chancellorDiscardingPolicy" &&
    $gameData?.players.self.isChancellor}
  visiblePlayerIds={$gameData?.players.visiblePlayerIds()}
/>
