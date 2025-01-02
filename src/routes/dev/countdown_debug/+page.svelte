<script lang="ts">
  import VoteView from "$lib/components/VoteView.svelte"

  let currentSession = {
    chancellorId: "player1",
    presidentId: "player2",
  }

  let open = true

  let players = {
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
    visibleRolePlayerIds: () => ["player1"],
  }

  let waiting = true
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
