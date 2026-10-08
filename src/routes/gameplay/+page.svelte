<script lang="ts">
  import Icon from "@iconify/svelte"
  import { Canvas } from "@threlte/core"
  import { getContext } from "svelte"
  import type { Readable } from "svelte/store"

  import { page } from "$app/stores"
  import * as ApiClient from "$lib/api_client"
  import ChancellorPolicyChooseView from "$lib/components/ChancellorPolicyChooseView.svelte"
  import ChooseChancellorView from "$lib/components/ChooseChancellorView.svelte"
  import Decor from "$lib/components/Decor.svelte"
  import GameEnding from "$lib/components/GameEnding.svelte"
  import GameplayScene from "$lib/components/GameplayScene.svelte"
  import PresidentialPowerExecution from "$lib/components/PresidentialPowerExecution.svelte"
  import PresidentialPowerInvestigation from "$lib/components/PresidentialPowerInvestigation.svelte"
  import PresidentialPowerPolicyPeek from "$lib/components/PresidentialPowerPolicyPeek.svelte"
  import PresidentialPowerSpecialElection from "$lib/components/PresidentialPowerSpecialElection.svelte"
  import PresidentPolicyChooseView from "$lib/components/PresidentPolicyChooseView.svelte"
  import PresidentReviewingVeto from "$lib/components/PresidentReviewingVeto.svelte"
  import VoteView from "$lib/components/VoteView.svelte"
  import WaitingForReconnect from "$lib/components/WaitingForReconnect.svelte"
  import type { GameData } from "$lib/game_data"
  import type { PlayerMembership } from "$lib/player"
  import { ownTurnText, playersToWaitFor } from "$lib/turn"

  const gameCode: string = $page.data.gameCode
  const gameData: Readable<GameData | undefined> = getContext("gameData") as Readable<
    GameData | undefined
  >

  let isMinimized: boolean = false
  let minimizedSubStatus: string | undefined

  let importantGameStatuses: string[] = [
    "election_voting",
    "presidentialPower_investigateLoyalty",
    "presidentialPower_policyPeek",
    "presidentialPower_callSpecialElection",
    "presidentialPower_execution",
  ]

  $: hasGameEnded = $gameData?.status !== undefined && $gameData.status === "gameEnded"

  // Minimizing only lasts for the current phase, so a new phase always opens its window
  $: if (isMinimized && $gameData?.subStatus !== minimizedSubStatus) {
    isMinimized = false
  }

  // Changes once per enacted policy, so it identifies the presidential power being used
  $: enactedPolicyCount =
    ($gameData?.policies.board?.liberal ?? 0) + ($gameData?.policies.board?.fascist ?? 0)

  $: ownTurn = ownTurnText($gameData)
  $: isFascist = $gameData?.players.self.membership === "fascist"
  $: isImportant =
    ownTurn !== undefined || importantGameStatuses.includes($gameData?.subStatus ?? "")
  $: minimizedText = ownTurn ?? statusText($gameData?.subStatus)

  function minimize() {
    minimizedSubStatus = $gameData?.subStatus
    isMinimized = true
  }

  function getGameWinningTeam(hasGameEnded: boolean): PlayerMembership | undefined {
    if (!hasGameEnded || $gameData?.subStatus === undefined) return

    return $gameData.subStatus.split("gameEnded_")[1] as PlayerMembership
  }

  function statusText(subStatus: string | undefined): string | undefined {
    switch (subStatus) {
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
      case "legislativeSession_chancellorSeekingVeto":
        return "The Chancellor is seeking a Veto"
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

<Decor
  {gameCode}
  gameData={$gameData}
  streamerModeEnabled={$page.data.streamerModeEnabled === true}
>
  {#if $gameData?.players?.all}
    <Canvas>
      <GameplayScene
        disablePan={true}
        disableRotation={true}
        electionTracker={$gameData?.electionTracker}
        playerCount={$gameData?.players.all?.length ?? 0}
        policies={{
          ...$gameData?.policies,
          drawPile: Array($gameData?.policies.drawPileCount()),
        }}
      />
    </Canvas>
  {/if}

  {#if !isMinimized}
    <ChooseChancellorView
      on:click={({ detail }) =>
        ApiClient.sendAction(gameCode, { type: "nominate", chancellorId: detail })}
      on:minimize={minimize}
      open={$gameData?.subStatus === "election_presidentChoosingChancellor"}
      players={$gameData?.players}
      president={$gameData?.currentSession?.president()}
    />

    <VoteView
      pauseEndsAt={$gameData?.pendingTransition?.at}
      currentSession={$gameData?.currentSession}
      on:minimize={minimize}
      on:vote={({ detail }) => ApiClient.sendAction(gameCode, { type: "vote", ja: detail })}
      open={$gameData?.subStatus === "election_voting" ||
        $gameData?.subStatus === "election_votingEnded"}
      players={$gameData?.players}
      waiting={$gameData?.subStatus === "election_voting"}
    />

    <PresidentPolicyChooseView
      currentSession={$gameData?.currentSession}
      on:click={({ detail }) => ApiClient.sendAction(gameCode, { type: "discard", policy: detail })}
      on:minimize={minimize}
      open={$gameData?.subStatus === "legislativeSession_presidentDiscardingPolicy"}
      players={$gameData?.players}
    />

    <ChancellorPolicyChooseView
      boardFascistPolicyCount={$gameData?.policies.board?.fascist}
      currentSession={$gameData?.currentSession}
      on:click={({ detail }) => ApiClient.sendAction(gameCode, { type: "discard", policy: detail })}
      on:veto={() => ApiClient.sendAction(gameCode, { type: "proposeVeto" })}
      on:minimize={minimize}
      open={$gameData?.subStatus === "legislativeSession_chancellorDiscardingPolicy"}
      players={$gameData?.players}
    />

    <PresidentReviewingVeto
      currentSession={$gameData?.currentSession}
      on:answer={({ detail: isAccepted }) =>
        ApiClient.sendAction(gameCode, { type: "answerVeto", accept: isAccepted })}
      on:minimize={minimize}
      open={$gameData?.subStatus === "legislativeSession_chancellorSeekingVeto"}
      players={$gameData?.players}
    />

    <PresidentialPowerPolicyPeek
      pauseEndsAt={$gameData?.pendingTransition?.at}
      {enactedPolicyCount}
      {gameCode}
      on:minimize={minimize}
      open={$gameData?.subStatus === "presidentialPower_policyPeek"}
      players={$gameData?.players}
      president={$gameData?.currentSession?.president()}
      presidentialPower={$gameData?.presidentialPower}
    />

    <PresidentialPowerInvestigation
      pauseEndsAt={$gameData?.pendingTransition?.at}
      beingInvestigatedPlayerId={$gameData?.currentSession?.beingInvestigatedPlayerId}
      {enactedPolicyCount}
      {gameCode}
      on:minimize={minimize}
      open={$gameData?.subStatus === "presidentialPower_investigateLoyalty"}
      players={$gameData?.players}
      president={$gameData?.currentSession?.president()}
      presidentialPower={$gameData?.presidentialPower}
    />

    <PresidentialPowerSpecialElection
      pauseEndsAt={$gameData?.pendingTransition?.at}
      on:click={({ detail }) =>
        ApiClient.sendAction(gameCode, { type: "usePower", targetId: detail })}
      on:minimize={minimize}
      open={$gameData?.subStatus === "presidentialPower_callSpecialElection"}
      players={$gameData?.players}
      president={$gameData?.currentSession?.president()}
      presidentialPower={$gameData?.presidentialPower}
      selectedPlayer={$gameData?.specialElectionPlayer}
    />

    <PresidentialPowerExecution
      pauseEndsAt={$gameData?.pendingTransition?.at}
      on:click={({ detail }) =>
        ApiClient.sendAction(gameCode, { type: "usePower", targetId: detail })}
      on:minimize={minimize}
      open={$gameData?.subStatus === "presidentialPower_execution"}
      players={$gameData?.players}
      president={$gameData?.currentSession?.president()}
      presidentialPower={$gameData?.presidentialPower}
    />
  {:else if minimizedText !== undefined}
    <button
      class="absolute inset-x-6 bottom-36 md:bottom-6 flex md:justify-center items-center gap-4 px-4 py-2 shadow-frame rounded-lg animate-pulse-slow {ownTurn ===
      undefined
        ? 'bg-[#141414]'
        : isFascist
        ? 'bg-red-fascist font-bold'
        : 'bg-blue-liberal font-bold'}"
      class:border-2={isImportant}
      class:border-white={ownTurn !== undefined}
      class:border-red-fascist={isImportant && ownTurn === undefined && isFascist}
      class:border-blue-liberal={isImportant && ownTurn === undefined && !isFascist}
      on:click={() => (isMinimized = false)}
    >
      <Icon icon="fa:window-restore" />
      {minimizedText}
    </button>
  {/if}

  <!-- Outside the minimizable windows: everyone must see how the game ended -->
  <GameEnding
    open={hasGameEnded}
    players={$gameData?.players}
    winningTeam={getGameWinningTeam(hasGameEnded)}
  />

  <WaitingForReconnect players={playersToWaitFor($gameData)} />
</Decor>
