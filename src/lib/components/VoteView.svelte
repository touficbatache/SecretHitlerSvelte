<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { fly } from "svelte/transition"

  import PlayfulButton from "$lib/components/PlayfulButton.svelte"
  import Players from "$lib/components/Players.svelte"
  import { Compact } from "$lib/enums"
  import type { GameDataPlayers, GameDataSession } from "$lib/game_data"
  import PlayerView from "$lib/components/PlayerView.svelte"
  import FloatingWindow from "$lib/components/FloatingWindow.svelte"

  export let currentSession: GameDataSession | undefined = undefined
  export let open: boolean
  export let players: GameDataPlayers | undefined = undefined
  export let waiting: boolean

  const dispatch = createEventDispatcher()

  let countDown: number = 4
  let isSetup: boolean = false
  let vote: boolean | undefined = undefined

  $: hasVoted =
    players === undefined ? false : Object.hasOwn(currentSession?.votes ?? {}, players.self.id)

  $: president = players?.all.find((player) => player.id === currentSession?.presidentId)
  $: chancellor = players?.all.find((player) => player.id === currentSession?.chancellorId)

  $: if (hasVoted && !waiting) {
    setupCountdown()
  }

  function setupCountdown() {
    if (isSetup) {
      return
    }

    isSetup = true

    setTimeout(async () => {
      while (countDown > 0) {
        countDown--
        await new Promise((f) => setTimeout(f, 1000))
      }
    }, 2000)
  }
</script>

<FloatingWindow allowDismiss={false} bind:open classes="w-full px-4 md:w-auto md:h-full md:py-4 md:flex md:items-center">
  <div class="w-full max-h-full p-10 shadow-frame bg-[#141414] rounded-lg">
    <div class="flex flex-col items-center gap-4">
      {#if president !== undefined && chancellor !== undefined}
        <span class="text-2xl font-futura"
          >{players?.self.id === president.id || players?.self.id === chancellor.id
            ? "Your"
            : "The"} Government</span
        >
        <div class="w-full grid grid-cols-2 px-10 gap-8">
          <PlayerView
            player={president}
            hideExtras={true}
            hideVotes={true}
            showRole={players?.visiblePlayerIds().includes(president.id)}
          />
          <PlayerView
            player={chancellor}
            hideExtras={true}
            hideVotes={true}
            showRole={players?.visiblePlayerIds().includes(chancellor.id)}
          />
        </div>
      {/if}
    </div>

    {#if !hasVoted}
      <div class="flex flex-col items-center gap-3 mt-7">
        <span class="text-2xl">Vote</span>
        <button
          class="relative w-32 rounded-xl rotate-90 border-2 p-2"
          class:border-transparent={vote !== true}
          class:border-white={vote === true}
          class:bg-black={vote === true}
          on:click={() => (vote = true)}
        >
          <img class="w-full rounded-lg aspect-[7/10] bg-contain bg-center bg-card-ballot-ja" />
          {#if vote === true}
            <iconify-icon
              class="absolute -left-3 -top-3 -rotate-90 text-2xl text-white bg-black rounded-full"
              icon="fa:check-circle"
            />
          {/if}
        </button>
        <button
          class="relative w-32 rounded-xl rotate-90 border-2 p-2 -mt-10"
          class:border-transparent={vote !== false}
          class:border-white={vote === false}
          class:bg-black={vote === false}
          on:click={() => (vote = false)}
        >
          <img
            class="w-full rounded-lg aspect-[7/10] bg-contain bg-center bg-card-ballot-nein"
          />
          {#if vote === false}
            <iconify-icon
              class="absolute -left-3 -top-3 -rotate-90 text-2xl text-white bg-black rounded-full"
              icon="fa:check-circle"
            />
          {/if}
        </button>
        <PlayfulButton
          enabled={vote !== undefined}
          on:click={() => {
            dispatch("vote", vote)
            vote = undefined
          }}
          small={true}
        >
          Vote
        </PlayfulButton>
      </div>
    {:else}
      <div class="flex flex-col items-center gap-7 mt-7">
        <span class="text-2xl font-futura">Votes</span>
        <Players
          cols={3}
          compact={Compact.never}
          hideExtras={true}
          hidePlacards={true}
          players={players?.all}
          showRoles={players?.visiblePlayerIds()}
        />
        {#if waiting}
          <span> Waiting for all votes... </span>
        {:else}
          <span>
            {#if Object.values(currentSession?.votes ?? {}).filter((val) => val === true).length > players.all.filter((player) => !player.isExecuted).length / 2.0}
              The Government has succeeded&nbsp;&nbsp;<iconify-icon
                class="text-white align-[-0.16rem]"
                icon="fa:check-circle"
              />
            {:else}
              The Government has failed&nbsp;&nbsp;<iconify-icon
                class="text-white align-[-0.16rem]"
                icon="fa:times-circle"
              />
            {/if}
          </span>
          <div class="relative">
            <span class="text-2xl invisible">{countDown}</span>
            {#key countDown}
              <span
                class="absolute inset-0 text-2xl"
                in:fly={{ duration: 700, y: "30px" }}
                out:fly={{ duration: 200, y: "-30px" }}
              >
                {4 > countDown && countDown > 0 ? countDown : ""}
              </span>
            {/key}
          </div>
        {/if}
      </div>
    {/if}
  </div>
</FloatingWindow>
