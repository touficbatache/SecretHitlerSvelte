<script lang="ts">
  import { getContext } from "svelte"
  import type { Writable } from "svelte/store"
  import { fade } from "svelte/transition"

  import { browser } from "$app/environment"
  import { goto } from "$app/navigation"
  import type { GameData } from "$lib/game_data"

  interface Step {
    text: string
    duration: number
    delay: number
  }

  const gameData = getContext("gameData") as Writable<GameData | undefined>

  $: if (browser) {
    if ($gameData?.settings?.skipLongIntro || $gameData?.status !== "settingUp") {
      goto("/gameplay")
    }
  }

  $: if ($gameData?.startedAt !== undefined) {
    setupIntro()
  }

  $: player = $gameData?.players?.self

  let isSetup = false

  let steps: Step[] = []
  let indexShown = 0

  function setupIntro() {
    if (isSetup) {
      return
    }

    isSetup = true

    // let startedAt = Date.now()
    let startedAt = $gameData?.startedAt

    switch ($gameData?.players?.self?.role) {
      case "liberal":
        steps = [
          {
            text: "You have a majority, but you don't know for sure who anyone is.",
            duration: 4000,
            delay: 0,
          },
          {
            text: "Win by enacting five Liberal Policies or killing the Secret Hitler.",
            duration: 5000,
            delay: 2000,
          },
          {
            text: "You lose if six Fascist Policies are enacted, or if Hitler is elected Chancellor after three Fascist Policies have been enacted (with three or more Fascist Policies on the board).",
            duration: 8000,
            delay: 2000,
          },
          {
            text: "Attention: The Fascists know Hitler's identity, but Hitler doesn't know them.",
            duration: 5000,
            delay: 2000,
          },
        ]
        break
      case "fascist":
        steps = [
          {
            text: "You must resort to secrecy and sabotage to accomplish your goals.",
            duration: 4000,
            delay: 2000,
          },
          {
            text: "Hitler plays for your team. Win by enacting six Fascist Policies, or by electing Hitler as Chancellor after three Fascist Policies have been enacted (with three or more Fascist Policies on the board).",
            duration: 8000,
            delay: 2000,
          },
          {
            text: "You lose if five Liberal Policies are enacted, or if Hitler is killed.",
            duration: 5000,
            delay: 2000,
          },
          {
            text: "Attention: You and your team know Hitler's identity, but Hitler doesn't know you.",
            duration: 5000,
            delay: 2000,
          },
        ]
        break
      case "hitler":
        steps = [
          {
            text: "You must resort to secrecy and sabotage to accomplish your goals.",
            duration: 4000,
            delay: 0,
          },
          {
            text: "You play for the Fascist team. Win by enacting six Fascist Policies, or by being elected as Chancellor after three Fascist Policies have been enacted (with three or more Fascist Policies on the board).",
            duration: 8000,
            delay: 2000,
          },
          {
            text: "You and your team lose if five Liberal Policies are enacted, or if you're killed.",
            duration: 5000,
            delay: 2000,
          },
          {
            text: "Attention: The Fascists know your identity, but you don't know them.",
            duration: 5000,
            delay: 2000,
          },
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
        .slice(0, index)
        .map((el) => el.delay)
        .reduce((a, b) => a + b, 0)

      setTimeout(() => (indexShown = index + 1), duration + delay - (currentTime - startedAt))
    }
  }
</script>

{#if $gameData?.players}
  <div class="w-full flex flex-col items-center gap-32 px-6 md:p-0">
    <div class="flex flex-col">
      <span class="font-futura text-lg uppercase tracking-widest">Your secret role</span>
      <h3 class="font-eskapade_fraktur text-6xl uppercase">{player?.role}</h3>
    </div>

    <div class="flex">
      <div
        class="z-30 rounded-md h-48 aspect-[7/10] bg-contain bg-center -rotate-[15deg] -ml-2.5 -mt-1"
        class:bg-card-role-fascist-frog={player?.assetReference === "fascist_frog"}
        class:bg-card-role-fascist-lizard={player?.assetReference === "fascist_lizard"}
        class:bg-card-role-fascist-snake={player?.assetReference === "fascist_snake"}
        class:bg-card-role-hitler={player?.assetReference === "hitler"}
        class:bg-card-role-liberal-1={player?.assetReference === "liberal_1"}
        class:bg-card-role-liberal-2={player?.assetReference === "liberal_2"}
        class:bg-card-role-liberal-3={player?.assetReference === "liberal_3"}
        class:bg-card-role-liberal-4={player?.assetReference === "liberal_4"}
        class:bg-card-role-liberal-5={player?.assetReference === "liberal_5"}
        class:bg-card-role-liberal-6={player?.assetReference === "liberal_6"}
      />
      <div
        class="z-20 rounded-md h-48 aspect-[7/10] bg-contain bg-center rotate-[15deg] -ml-2 -mt-1"
        class:bg-card-membership-liberal={player?.membership === "liberal"}
        class:bg-card-membership-fascist={player?.membership === "fascist"}
      />
    </div>
    <div class="relative w-full h-32">
      {#each steps as step, index}
        {#if indexShown === index}
          <div
            class="absolute top-1/2 -translate-y-1/2 text-center"
            out:fade={{ duration: 500 }}
            in:fade={{ delay: step.delay, duration: 500 }}
          >
            {step.text}
          </div>
        {/if}
      {/each}
    </div>
  </div>
{/if}
