<script lang="ts">
  import Icon from "@iconify/svelte"
  import { Canvas } from "@threlte/core"
  import { getContext } from "svelte"
  import type { Readable } from "svelte/store"

  import { browser } from "$app/environment"
  import { goto } from "$app/navigation"
  import { page } from "$app/stores"
  import * as ApiClient from "$lib/api_client"
  import ChancellorPolicyChooseView from "$lib/components/ChancellorPolicyChooseView.svelte"
  import ChooseChancellorView from "$lib/components/ChooseChancellorView.svelte"
  import Decor from "$lib/components/Decor.svelte"
  import GameplayScene from "$lib/components/GameplayScene.svelte"
  import PresidentialPowerExecution from "$lib/components/PresidentialPowerExecution.svelte"
  import PresidentialPowerInvestigation from "$lib/components/PresidentialPowerInvestigation.svelte"
  import PresidentialPowerPolicyPeek from "$lib/components/PresidentialPowerPolicyPeek.svelte"
  import PresidentialPowerSpecialElection from "$lib/components/PresidentialPowerSpecialElection.svelte"
  import PresidentPolicyChooseView from "$lib/components/PresidentPolicyChooseView.svelte"
  import VoteView from "$lib/components/VoteView.svelte"
  import type { GameData } from "$lib/game_data"

  const gameCode: string = $page.data.gameCode
  const gameData: Readable<GameData | undefined> = getContext("gameData") as Readable<
    GameData | undefined
  >

  let isMinimized: boolean = false

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

  function statusText() {
    switch ($gameData?.subStatus) {
      case "election_presidentChoosingChancellor":
        return "The President is choosing their Chancellor"
      case "election_voting":
        return "A vote is taking place"
      case "election_votingEnded":
        return "Voting has ended"
      case "legislativeSession_presidentDiscardingPolicy":
        return "The President is discarding a policy"
      case "legislativeSession_chancellorDiscardingPolicy":
        return "The Chancellor is discarding a policy"
      case "presidentialPower_policyPeek":
        return "The President is peeking at the policies"
      case "presidentialPower_investigateLoyalty":
        return "The President is investigating a player"
      case "presidentialPower_callSpecialElection":
        return "The President's calling for a special election"
      case "presidentialPower_execution":
        return "The President is executing a player"
    }
  }
</script>

<Decor {gameCode} gameData={$gameData}>
  {#if $gameData?.players?.all}
    <Canvas>
      <GameplayScene
        disableRotation={true}
        electionTracker={$gameData?.electionTracker}
        playerCount={$gameData?.players.all?.length ?? 0}
        policies={$gameData?.policies}
      />
    </Canvas>
  {/if}

  {#if !isMinimized}
    <ChooseChancellorView
      on:click={({ detail }) => ApiClient.chooseChancellor(gameCode, detail)}
      on:minimize={() => (isMinimized = true)}
      open={$gameData?.subStatus === "election_presidentChoosingChancellor"}
      players={$gameData?.players}
      president={$gameData?.currentSession?.president()}
    />

    <VoteView
      currentSession={$gameData?.currentSession}
      on:minimize={() => (isMinimized = true)}
      on:vote={({ detail }) => ApiClient.vote(gameCode, detail)}
      open={$gameData?.subStatus === "election_voting" ||
        $gameData?.subStatus === "election_votingEnded"}
      players={$gameData?.players}
      waiting={$gameData?.subStatus === "election_voting"}
    />

    <PresidentPolicyChooseView
      currentSession={$gameData?.currentSession}
      on:click={({ detail }) => ApiClient.presidentDiscardPolicy(gameCode, detail)}
      on:minimize={() => (isMinimized = true)}
      open={$gameData?.subStatus === "legislativeSession_presidentDiscardingPolicy"}
      players={$gameData?.players}
    />

    <ChancellorPolicyChooseView
      currentSession={$gameData?.currentSession}
      on:click={({ detail }) => ApiClient.chancellorDiscardPolicy(gameCode, detail)}
      on:minimize={() => (isMinimized = true)}
      open={$gameData?.subStatus === "legislativeSession_chancellorDiscardingPolicy"}
      players={$gameData?.players}
    />

    <PresidentialPowerPolicyPeek
      {gameCode}
      on:minimize={() => (isMinimized = true)}
      open={$gameData?.subStatus === "presidentialPower_policyPeek"}
      players={$gameData?.players}
      president={$gameData?.currentSession?.president()}
      presidentialPower={$gameData?.presidentialPower}
    />

    <PresidentialPowerInvestigation
      beingInvestigatedPlayerId={$gameData?.currentSession?.beingInvestigatedPlayerId}
      {gameCode}
      on:minimize={() => (isMinimized = true)}
      open={$gameData?.subStatus === "presidentialPower_investigateLoyalty"}
      players={$gameData?.players}
      president={$gameData?.currentSession?.president()}
      presidentialPower={$gameData?.presidentialPower}
    />

    <PresidentialPowerSpecialElection
      on:click={({ detail }) => ApiClient.presidentialPower_specialElection(gameCode, detail)}
      on:minimize={() => (isMinimized = true)}
      open={$gameData?.subStatus === "presidentialPower_callSpecialElection"}
      players={$gameData?.players}
      president={$gameData?.currentSession?.president()}
      presidentialPower={$gameData?.presidentialPower}
      selectedPlayer={$gameData?.specialElectionPlayer}
    />

    <PresidentialPowerExecution
      on:click={({ detail }) => ApiClient.presidentialPower_execution(gameCode, detail)}
      on:minimize={() => (isMinimized = true)}
      open={$gameData?.subStatus === "presidentialPower_execution"}
      players={$gameData?.players}
      president={$gameData?.currentSession?.president()}
      presidentialPower={$gameData?.presidentialPower}
    />
  {:else}
    <button
      class="absolute inset-x-6 bottom-36 md:bottom-6 flex items-center gap-4 px-4 py-2 shadow-frame bg-[#141414] rounded-lg animate-pulse-slow"
      on:click={() => (isMinimized = false)}
    >
      <Icon icon="fa:window-restore" />
      {statusText($gameData?.subStatus) ?? "..."}
    </button>
  {/if}
</Decor>
