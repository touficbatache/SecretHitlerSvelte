<script lang="ts">
  import { createEventDispatcher } from "svelte"

  import CountDown from "$lib/components/CountDown.svelte"
  import FloatingWindow from "$lib/components/FloatingWindow.svelte"
  import Players from "$lib/components/Players.svelte"
  import PlayerView from "$lib/components/PlayerView.svelte"
  import PlayfulButton from "$lib/components/PlayfulButton.svelte"
  import { Compact } from "$lib/enums"
  import type { GameDataPlayers, GameDataSession } from "$lib/game_data"

  export let currentSession: GameDataSession | undefined = undefined
  export let open: boolean
  export let players: GameDataPlayers | undefined = undefined
  export let waiting: boolean

  const dispatch = createEventDispatcher()

  let vote: boolean | undefined = undefined

  $: hasVoted =
    players === undefined ? false : Object.hasOwn(currentSession?.votes ?? {}, players.self.id)

  $: president = players?.all.find((player) => player.id === currentSession?.presidentId)
  $: chancellor = players?.all.find((player) => player.id === currentSession?.chancellorId)
</script>

<FloatingWindow
  allowDismiss={false}
  allowMinimize={true}
  bind:open
  classes="w-full px-4 md:w-auto md:h-full md:py-4 md:flex md:items-center"
  on:minimize
>
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
            showRole={players?.visibleRolePlayerIds().includes(president.id)}
          />
          <PlayerView
            player={chancellor}
            hideExtras={true}
            hideVotes={true}
            showRole={players?.visibleRolePlayerIds().includes(chancellor.id)}
          />
        </div>
      {/if}
    </div>

    {#if !hasVoted && players?.self.isExecuted === false}
      <div class="flex flex-col items-center gap-3 mt-7">
        <span class="text-2xl">Vote</span>
        <button
          class="relative w-32 rounded-xl rotate-90 border-2 p-2"
          class:border-transparent={vote !== true}
          class:border-white={vote === true}
          class:bg-black={vote === true}
          on:click={() => (vote = true)}
        >
          <div class="w-full rounded-lg aspect-[7/10] bg-contain bg-center bg-card-ballot-ja" />
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
          <div class="w-full rounded-lg aspect-[7/10] bg-contain bg-center bg-card-ballot-nein" />
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
          size="small"
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
          players={players?.alive()}
          showRoles={players?.visibleRolePlayerIds()}
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
          <CountDown trigger={hasVoted && !waiting} />
        {/if}
      </div>
    {/if}
  </div>
</FloatingWindow>
