<script lang="ts">
  import { getContext } from "svelte"
  import type { Writable } from "svelte/store"
  import { fade } from "svelte/transition"

  import { serverNow } from "$lib/clock"
  import CountDown from "$lib/components/CountDown.svelte"
  import IntroStep1 from "$lib/components/intro/IntroStep1.svelte"
  import IntroStep2 from "$lib/components/intro/IntroStep2.svelte"
  import IntroStep3 from "$lib/components/intro/IntroStep3.svelte"
  import IntroStep4 from "$lib/components/intro/IntroStep4.svelte"
  import RoleHeader from "$lib/components/RoleHeader.svelte"
  import type { GameData } from "$lib/game_data"
  import { createTimers, type Timers } from "$lib/timers"

  const timers: Timers = createTimers()

  interface Step {
    text: string
    duration: number
  }

  const gameData: Writable<GameData | undefined> = getContext("gameData") as Writable<
    GameData | undefined
  >

  let isSetup: boolean = false

  let steps: Step[] | undefined
  let stepShown: number = 1

  $: player = $gameData?.players?.self

  // The server ends the intro at this time; every screen counts down to it
  $: introEndsAt = $gameData?.pendingTransition?.at

  $: if (player && !$gameData?.settings?.skipLongIntro) {
    setupLongIntro()
  }

  function setupLongIntro() {
    if (isSetup) {
      return
    }

    isSetup = true

    let startedAt: number = $gameData?.startedAt ?? serverNow()

    switch (player?.membership) {
      case "liberal":
        steps = [
          {
            text: "You have a majority, but you don't know for sure who anyone is.",
            duration: 5000,
          },
          {
            text: "Win by enacting 5 Liberal Policies. Or by killing the Secret Hitler.",
            duration: 10000,
          },
          {
            text: "You lose if six Fascist Policies are enacted. Or if Hitler is elected Chancellor after three Fascist Policies have been enacted (with 3+ Fascist policies on the board).",
            duration: 11000,
          },
          {
            text: "Countdown",
            duration: 4000,
          },
        ]
        break
      case "fascist":
        steps = [
          {
            text: "You must resort to secrecy and sabotage to accomplish your goals.",
            duration: 5000,
          },
          {
            text: "Hitler plays for your team. Win by enacting six Fascist Policies. Or by electing Hitler as Chancellor after three Fascist Policies have been enacted (with 3+ Fascist policies on the board).",
            duration: 12000,
          },
          {
            text: "You lose if five Liberal Policies are enacted. Or if Hitler is killed.",
            duration: 9000,
          },
          {
            text: "Countdown",
            duration: 4000,
          },
        ]
        break
    }

    let currentTime: number = serverNow()

    for (const index of steps.keys()) {
      const duration: number = steps
        .slice(0, index + 1)
        .map((step) => step.duration)
        .reduce((a, b) => a + b, 0)

      timers.setTimeout(() => {
        stepShown = index + 2
      }, duration - (currentTime - startedAt))
    }
  }
</script>

{#if $gameData?.players}
  {#if stepShown < (steps?.length ?? 2)}
    <div class="absolute top-5 inset-x-0 mx-2" transition:fade={{ duration: 300 }}>
      <RoleHeader {player} />
    </div>
  {/if}

  {#if stepShown === 1}
    <div
      class="absolute inset-0 flex flex-col justify-center items-center gap-16 md:pt-10 px-6 md:p-0"
      transition:fade={{ duration: 300 }}
    >
      <IntroStep1 {player} />
    </div>
  {:else if stepShown === 2}
    <div
      class="absolute inset-0 flex flex-col justify-between items-center pt-20 pb-5"
      transition:fade={{ duration: 300 }}
    >
      <IntroStep2 {player} players={$gameData?.players} />
    </div>
  {:else if stepShown === 3}
    <div
      class="absolute inset-0 flex flex-col justify-between items-center pt-20 pb-5"
      transition:fade={{ duration: 300 }}
    >
      <IntroStep3 {player} />
    </div>
  {:else if stepShown === 4}
    <div
      class="absolute inset-0 flex flex-col justify-between items-center pt-20 pb-5"
      transition:fade={{ duration: 300 }}
    >
      <IntroStep4 until={introEndsAt} />
    </div>
  {/if}

  {#if $gameData?.settings?.skipLongIntro}
    <CountDown
      classContainer=""
      classNumber="absolute bottom-16 md:bottom-10 left-1/2 -translate-x-1/2 text-4xl"
      until={introEndsAt}
    />
  {/if}
{/if}
