<script lang="ts">
  import VoteView from "$lib/components/VoteView.svelte"
  import type { GameDataPlayers, GameDataSession } from "$lib/game_data"

  let currentSession: GameDataSession = {
    president: () => players.all.find((player) => player.id === "player2"),
    presidentId: "player2",
    presidentPolicies: undefined,
    chancellor: () => players.all.find((player) => player.id === "player1"),
    chancellorId: "player1",
    chancellorPolicies: undefined,
    votes: undefined,
    beingInvestigatedPlayerId: undefined,
    isVetoRefused: undefined,
  }

  let open: boolean = true

  let players: GameDataPlayers = {
    self: {
      id: "player1",
      assetReference: "liberal_5",
      name: "player1",
      role: "liberal",
      membership: "liberal",
      self: true,
      isConnected: true,
      isExecuted: false,
      isInvestigated: false,
      isPresident: false,
      isChancellor: true,
      isPreviousChancellor: true,
      vote: () => undefined,
    },
    all: [
      {
        id: "player2",
        assetReference: "hitler",
        name: "player2",
        role: "hitler",
        membership: "fascist",
        self: false,
        isConnected: false,
        isExecuted: false,
        isInvestigated: false,
        isPresident: true,
        isChancellor: false,
        isPreviousChancellor: false,
        vote: () => undefined,
      },
      {
        id: "player1",
        assetReference: "liberal_5",
        name: "player1",
        role: "liberal",
        membership: "liberal",
        self: true,
        isConnected: true,
        isExecuted: false,
        isInvestigated: false,
        isPresident: false,
        isChancellor: true,
        isPreviousChancellor: true,
        vote: () => true,
      },
      {
        id: "player3",
        assetReference: "fascist_frog",
        name: "player3",
        role: "fascist",
        membership: "fascist",
        self: false,
        isConnected: true,
        isExecuted: false,
        isInvestigated: false,
        isPresident: false,
        isChancellor: false,
        isPreviousChancellor: false,
        vote: () => undefined,
      },
      {
        id: "player4",
        assetReference: "liberal_1",
        name: "player4",
        role: "liberal",
        membership: "liberal",
        self: false,
        isConnected: true,
        isExecuted: true,
        isInvestigated: false,
        isPresident: false,
        isChancellor: false,
        isPreviousChancellor: false,
        vote: () => undefined,
      },
      {
        id: "player5",
        assetReference: "liberal_6",
        name: "player5",
        role: "liberal",
        membership: "liberal",
        self: false,
        isConnected: true,
        isExecuted: true,
        isInvestigated: false,
        isPresident: false,
        isChancellor: false,
        isPreviousChancellor: false,
        vote: () => undefined,
      },
      {
        id: "player6",
        assetReference: "liberal_3",
        name: "player6",
        role: "liberal",
        membership: "liberal",
        self: false,
        isConnected: true,
        isExecuted: false,
        isInvestigated: false,
        isPresident: false,
        isChancellor: false,
        isPreviousChancellor: false,
        vote: () => undefined,
      },
    ],
    others: [
      {
        id: "player3",
        assetReference: "fascist_frog",
        name: "player3",
        role: "fascist",
        membership: "fascist",
        self: false,
        isConnected: true,
        isExecuted: false,
        isInvestigated: false,
        isPresident: false,
        isChancellor: false,
        isPreviousChancellor: false,
        vote: () => undefined,
      },
      {
        id: "player4",
        assetReference: "liberal_1",
        name: "player4",
        role: "liberal",
        membership: "liberal",
        self: false,
        isConnected: true,
        isExecuted: true,
        isInvestigated: false,
        isPresident: false,
        isChancellor: false,
        isPreviousChancellor: false,
        vote: () => undefined,
      },
      {
        id: "player5",
        assetReference: "liberal_6",
        name: "player5",
        role: "liberal",
        membership: "liberal",
        self: false,
        isConnected: true,
        isExecuted: true,
        isInvestigated: false,
        isPresident: false,
        isChancellor: false,
        isPreviousChancellor: false,
        vote: () => undefined,
      },
      {
        id: "player6",
        assetReference: "liberal_3",
        name: "player6",
        role: "liberal",
        membership: "liberal",
        self: false,
        isConnected: true,
        isExecuted: false,
        isInvestigated: false,
        isPresident: false,
        isChancellor: false,
        isPreviousChancellor: false,
        vote: () => undefined,
      },
      {
        id: "player2",
        assetReference: "hitler",
        name: "player2",
        role: "hitler",
        membership: "fascist",
        self: false,
        isConnected: false,
        isExecuted: false,
        isInvestigated: false,
        isPresident: true,
        isChancellor: false,
        isPreviousChancellor: false,
        vote: () => undefined,
      },
    ],
    fascists: [
      {
        id: "player2",
        assetReference: "hitler",
        name: "player2",
        role: "hitler",
        membership: "fascist",
        self: false,
        isConnected: false,
        isExecuted: false,
        isInvestigated: false,
        isPresident: true,
        isChancellor: false,
        isPreviousChancellor: false,
        vote: () => undefined,
      },
      {
        id: "player3",
        assetReference: "fascist_frog",
        name: "player3",
        role: "fascist",
        membership: "fascist",
        self: false,
        isConnected: true,
        isExecuted: false,
        isInvestigated: false,
        isPresident: false,
        isChancellor: false,
        isPreviousChancellor: false,
        vote: () => undefined,
      },
    ],
    liberals: [
      {
        id: "player1",
        assetReference: "liberal_5",
        name: "player1",
        role: "liberal",
        membership: "liberal",
        self: true,
        isConnected: true,
        isExecuted: false,
        isInvestigated: false,
        isPresident: false,
        isChancellor: true,
        isPreviousChancellor: true,
        vote: () => undefined,
      },
      {
        id: "player4",
        assetReference: "liberal_1",
        name: "player4",
        role: "liberal",
        membership: "liberal",
        self: false,
        isConnected: true,
        isExecuted: true,
        isInvestigated: false,
        isPresident: false,
        isChancellor: false,
        isPreviousChancellor: false,
        vote: () => undefined,
      },
      {
        id: "player5",
        assetReference: "liberal_6",
        name: "player5",
        role: "liberal",
        membership: "liberal",
        self: false,
        isConnected: true,
        isExecuted: true,
        isInvestigated: false,
        isPresident: false,
        isChancellor: false,
        isPreviousChancellor: false,
        vote: () => undefined,
      },
      {
        id: "player6",
        assetReference: "liberal_3",
        name: "player6",
        role: "liberal",
        membership: "liberal",
        self: false,
        isConnected: true,
        isExecuted: false,
        isInvestigated: false,
        isPresident: false,
        isChancellor: false,
        isPreviousChancellor: false,
        vote: () => undefined,
      },
    ],
    alive: () => [
      {
        id: "player2",
        assetReference: "hitler",
        name: "player2",
        role: "hitler",
        membership: "fascist",
        self: false,
        isConnected: false,
        isExecuted: false,
        isInvestigated: false,
        isPresident: true,
        isChancellor: false,
        isPreviousChancellor: false,
        vote: () => undefined,
      },
      {
        id: "player1",
        assetReference: "liberal_5",
        name: "player1",
        role: "liberal",
        membership: "liberal",
        self: true,
        isConnected: true,
        isExecuted: false,
        isInvestigated: false,
        isPresident: false,
        isChancellor: true,
        isPreviousChancellor: true,
        vote: () => true,
      },
      {
        id: "player3",
        assetReference: "fascist_frog",
        name: "player3",
        role: "fascist",
        membership: "fascist",
        self: false,
        isConnected: true,
        isExecuted: false,
        isInvestigated: false,
        isPresident: false,
        isChancellor: false,
        isPreviousChancellor: false,
        vote: () => undefined,
      },
      {
        id: "player6",
        assetReference: "liberal_3",
        name: "player6",
        role: "liberal",
        membership: "liberal",
        self: false,
        isConnected: true,
        isExecuted: false,
        isInvestigated: false,
        isPresident: false,
        isChancellor: false,
        isPreviousChancellor: false,
        vote: () => undefined,
      },
    ],
    eligibleForChancellor: () => [],
    visibleRolePlayerIds: () => ["player1"],
  }

  let waiting: boolean = true
</script>

<VoteView {currentSession} {open} {players} {waiting} />

<div class="absolute z-max top-4 left-4">
  <button
    class="p-4 bg-white text-black hover:bg-neutral-200 active:bg-neutral-300"
    on:click={() => {
      currentSession = {
        ...currentSession,
        votes: {
          player1: true,
        },
      }
    }}
  >
    Vote yes
  </button>

  <button
    class="p-4 bg-white text-black hover:bg-neutral-200 active:bg-neutral-300"
    on:click={() => {
      waiting = false
    }}
  >
    Waiting false
  </button>

  <button
    class="p-4 bg-white text-black hover:bg-neutral-200 active:bg-neutral-300"
    on:click={() => {
      currentSession = {
        ...currentSession,
        votes: undefined,
      }
      waiting = true
    }}
  >
    Unvote
  </button>

  <button
    class="p-4 bg-white text-black hover:bg-neutral-200 active:bg-neutral-300"
    on:click={() => {
      open = !open
    }}
  >
    Toggle open
  </button>
</div>
