<script lang="ts">
  import { getContext } from "svelte"
  import type { Writable } from "svelte/store"
  import { fade } from "svelte/transition"

  import { browser } from "$app/environment"
  import type { GameData } from "$lib/game_data"
  import IntroStep1 from "$lib/components/intro/IntroStep1.svelte"
  import IntroStep2 from "$lib/components/intro/IntroStep2.svelte"
  import IntroStep3 from "$lib/components/intro/IntroStep3.svelte"
  import RoleHeader from "$lib/components/RoleHeader.svelte"

  interface Step {
    text: string
    duration: number
    delay: number
  }

  const gameData = getContext("gameData") as Writable<GameData | undefined>

  $: if (browser) {
    if ($gameData?.settings?.skipLongIntro || $gameData?.status !== "settingUp") {
      // TODO: uncomment
      // goto("/gameplay")
    }
  }

  $: if ($gameData?.startedAt !== undefined) {
    setupIntro()
  }

  $: player = { role: "liberal", membership: "liberal", assetReference: "liberal_6" }
  // $: player = { role: "fascist", membership: "fascist", assetReference: "fascist_snake" }
  // $: player = { role: "hitler", membership: "fascist", assetReference: "hitler" }
  // TODO: uncomment
  // $: player = $gameData?.players?.self

  let isSetup = false

  let steps: Step[] = []
  let indexShown = 0

  function setupIntro() {
    if (isSetup) {
      return
    }

    isSetup = true

    let startedAt = Date.now()
    // TODO: uncomment
    // let startedAt = $gameData?.startedAt

    switch (player?.role) {
      case "liberal":
        steps = [
          {
            text: "You have a majority, but you don't know for sure who anyone is.",
            duration: 5000,
            delay: 0,
          },
          {
            text: "Win by enacting 5 Liberal Policies,<br/><br/>or by killing the Secret Hitler.",
            duration: 7000,
            delay: 2000,
          },
          {
            text: "You lose if six Fascist Policies are enacted, or if Hitler is elected Chancellor after three Fascist Policies have been enacted (with three or more Fascist Policies on the board).",
            duration: 10000,
            delay: 2000,
          },
          // {
          //   text: "Attention: The Fascists know Hitler's identity, but Hitler doesn't know them.",
          //   duration: 5000,
          //   delay: 2000,
          // },
        ]
        break
      case "fascist":
        steps = [
          {
            text: "You must resort to secrecy and sabotage to accomplish your goals.",
            duration: 5000,
            delay: 2000,
          },
          {
            text: "Hitler plays for your team. Win by enacting six Fascist Policies, or by electing Hitler as Chancellor after three Fascist Policies have been enacted (with three or more Fascist Policies on the board).",
            duration: 12000,
            delay: 2000,
          },
          {
            text: "You lose if five Liberal Policies are enacted, or if Hitler is killed.",
            duration: 5000,
            delay: 2000,
          },
          // {
          //   text: "Attention: You and your team know Hitler's identity, but Hitler doesn't know you.",
          //   duration: 5000,
          //   delay: 2000,
          // },
        ]
        break
      case "hitler":
        steps = [
          {
            text: "You must resort to secrecy and sabotage to accomplish your goals.",
            duration: 5000,
            delay: 0,
          },
          {
            text: "You play for the Fascist team. Win by enacting six Fascist Policies, or by being elected as Chancellor after three Fascist Policies have been enacted (with three or more Fascist Policies on the board).",
            duration: 12000,
            delay: 2000,
          },
          {
            text: "You and your team lose if five Liberal Policies are enacted, or if you're killed.",
            duration: 5000,
            delay: 2000,
          },
          // {
          //   text: "Attention: The Fascists know your identity, but you don't know them.",
          //   duration: 5000,
          //   delay: 2000,
          // },
        ]
        break
    }

    let currentTime = Date.now()

    for (const index of steps.keys()) {
      const duration = steps
        .slice(0, index + 1)
        .map((el) => el.duration)
        .reduce((a, b) => a + b, 0)

      const delay = steps
        .slice(0, index + 1)
        .map((el) => el.delay)
        .reduce((a, b) => a + b, 0)

      setTimeout(() => (indexShown = index + 1), duration + delay - (currentTime - startedAt))
    }

    indexShown = 0
  }
</script>

{#if $gameData?.players}
  {#if indexShown < steps.length}
    <div
      class="absolute top-5 inset-x-0 mx-2"
      in:fade={{ delay: steps[0]?.delay ?? 0, duration: 500 }}
      out:fade={{ duration: 500 }}
    >
      <RoleHeader {player} />
    </div>
  {/if}

  {@const step = steps[indexShown]}
  {#if indexShown === 0}
    <div
      class="absolute inset-0 flex flex-col justify-center items-center gap-24 px-6 md:p-0"
      out:fade={{ duration: 500 }}
      in:fade={{ delay: step.delay, duration: 500 }}
    >
      <IntroStep1 {player} />
    </div>
  {:else if indexShown === 1}
    <div
      class="absolute inset-0 flex flex-col justify-between items-center py-5"
      out:fade={{ duration: 500 }}
      in:fade={{ delay: step.delay, duration: 500 }}
    >
      <IntroStep2 {player} players={$gameData?.players} />
    </div>
  {:else if indexShown === 2}
    <div
      class="absolute inset-0 flex flex-col justify-between items-center py-5"
      out:fade={{ duration: 500 }}
      in:fade={{ delay: step.delay, duration: 500 }}
    >
      <IntroStep3 {player} />
    </div>
  {/if}
{/if}
