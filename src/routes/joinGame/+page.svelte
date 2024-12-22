<script lang="ts">
  import Icon from "@iconify/svelte"
  import TimeAgo from "javascript-time-ago"
  import en from "javascript-time-ago/locale/en"
  import { onMount } from "svelte"

  import { goto } from "$app/navigation"
  import { page } from "$app/stores"
  import * as ApiClient from "$lib/api_client"
  import type { GameplayApiResponse } from "$lib/api_client"
  import FloatingWindow from "$lib/components/FloatingWindow.svelte"
  import PaperBack from "$lib/components/PaperBack.svelte"
  import PinInput from "$lib/components/PinInput.svelte"
  import PlayfulButton from "$lib/components/PlayfulButton.svelte"
  import PlayfulIconButton from "$lib/components/PlayfulIconButton.svelte"

  // We use "en-US" because it's the default used by Date.now() in the server
  TimeAgo.addDefaultLocale(en)
  const timeAgo: TimeAgo = new TimeAgo("en-US")

  let error: string = ""
  let gameCode: string = ""
  let isJoining: boolean = false

  let expandJoinableGames: boolean = false
  let expandWatchableGames: boolean = false

  let showWatchDialog: boolean = false

  $: joinableGames = expandJoinableGames
    ? $page.data.joinableGames
    : $page.data.joinableGames.slice(0, 2)
  $: watchableGames = expandWatchableGames
    ? $page.data.watchableGames
    : $page.data.watchableGames.slice(0, 2)

  async function join(gameCode: string) {
    error = ""
    isJoining = true
    const response: GameplayApiResponse = await ApiClient.joinGame(gameCode)
    if (response.success) {
      await goto("/waitingRoom", { replaceState: true })
    }
    if (response.error !== undefined) {
      error = `${response.error.code} - ${response.error.message}`
      isJoining = false
    }
  }

  onMount(() => {
    if ($page.data.gameCode !== undefined) {
      goto("/reconnect", { replaceState: true })
    }
  })
</script>

{#if $page.data.gameCode === undefined}
  <FloatingWindow bind:open={showWatchDialog} classes="w-full md:w-auto px-10 md:px-0">
    <div class="px-6 py-6 flex flex-col items-center bg-[#141414] shadow-frame rounded-lg">
      <h5 class="text-2xl">Coming soon: watch another game</h5>
      <PlayfulButton
        extraClasses="mt-4"
        on:click={() => (showWatchDialog = false)}
        size="extra-small"
      >
        OK
      </PlayfulButton>
    </div>
  </FloatingWindow>
  <div
    class="w-full h-full flex flex-col md:flex-row justify-between md:items-center gap-6 md:gap-10 px-6 pb-8 md:px-16 md:py-4 overflow-y-auto"
    class:pt-20={!expandJoinableGames && !expandWatchableGames}
    class:pt-8={expandJoinableGames || expandWatchableGames}
  >
    {#if !expandJoinableGames && !expandWatchableGames}
      <div class="absolute top-0 left-0">
        <PlayfulIconButton
          extraClasses="w-10 h-[36px] m-4 aspect-square"
          icon="fa:arrow-left"
          on:click={() => window.history.back()}
          type="button"
        />
      </div>
      <form
        class="md:flex-1 w-full flex flex-col justify-center items-center gap-4 md:gap-10 p-6 md:px-10 md:py-8 bg-neutral-800 shadow-frame rounded-lg"
      >
        <span class="text-xl">Enter game code</span>
        <PinInput
          isEnabled={!isJoining}
          inactiveClass="bg-button-500 text-sh-yellow-500"
          activeClass="bg-sh-yellow-500 bg-opacity-70 text-sh-yellow-500 border-2 border-sh-yellow-500 border-opacity-70"
          bind:pin={gameCode}
        />
        {#if error.length > 0}
          <span class="text-[#B71C1C]">Error: {error}</span>
        {/if}
        <PlayfulButton
          enabled={gameCode.length === 6 && !isJoining}
          extraClasses="w-full"
          on:click={() => join(gameCode)}
          size="small"
          type="submit"
        >
          {#if !isJoining}
            Join
          {:else}
            Joining...
          {/if}
        </PlayfulButton>
      </form>
    {/if}
    <div class="md:flex-1 w-full h-full flex flex-col">
      <PaperBack
        classes="w-full"
        contentClasses="flex justify-center gap-6 px-10 py-2"
        backgroundColor="#FBB969"
      >
        <div class="relative z-10">
          <div
            class="pointer-events-none absolute w-full -z-[1] left-1/2 top-[calc(50%+.7px)] -translate-x-1/2 -translate-y-1/2"
            style="-webkit-text-stroke: black 3.2px;"
          >
            <h3 class="font-eskapade_fraktur text-3xl">Public games</h3>
          </div>
          <h3 class="font-eskapade_fraktur text-3xl text-white">Public games</h3>
        </div>
      </PaperBack>
      {#if !expandWatchableGames}
        <div
          class="flex-1 flex flex-col items-center gap-2 mt-4 px-3 pt-2 pb-3 bg-neutral-800 shadow-frame rounded-lg"
        >
          <span class="self-stretch flex items-center gap-2">
            <Icon class="md:text-xl" icon="fa6-solid:gamepad" /> Join & play ({$page.data
              .joinableGames.length})
          </span>
          {#if $page.data.joinableGames.length === 0}
            <div class="my-auto flex flex-col items-center gap-3">
              <span>No&nbsp;one's&nbsp;playing&nbsp;right&nbsp;now, but&nbsp;you&nbsp;can:</span>
              <PlayfulButton size="extra-small" on:click={() => goto("/createGame")}
                >Create a game</PlayfulButton
              >
            </div>
          {:else}
            <ul class="self-stretch flex-1 flex flex-col gap-2">
              {#each joinableGames as { createdAt, code, playerCount, startedAt, visibility, status, subStatus }}
                <li
                  class="flex justify-around items-center py-1.5 bg-neutral-50/5 shadow-frame rounded-l-lg rounded-r-lg"
                >
                  <div class="flex gap-1">
                    <div class="col-span-2 justify-self-center flex items-center gap-0.5">
                      {#each Array(6) as i}
                        <span
                          class="w-5 rounded-sm md:rounded-md bg-button-500 text-sh-yellow-500 text-center text-lg px-1 md:py-0.5"
                        >
                          •
                        </span>
                      {/each}
                    </div>
                  </div>
                  <div class="hidden md:flex items-center md:pl-4 md:pr-1.5 text-nowrap">
                    {playerCount} player{playerCount === 1 ? "" : "s"}
                  </div>
                  <div class="hidden md:flex items-center md:pl-1.5 md:pr-4 text-nowrap">
                    {@html timeAgo.format(createdAt, "mini").replace(/ /g, "&nbsp;")} ago
                  </div>
                  <div class="md:hidden flex flex-col gap-1">
                    <span>
                      {playerCount} player{playerCount === 1 ? "" : "s"}
                    </span>
                    <span>
                      {@html timeAgo.format(createdAt, "mini").replace(/ /g, "&nbsp;")} ago
                    </span>
                  </div>
                  <PlayfulButton
                    enabled={!isJoining}
                    extraClasses="text-sm"
                    on:click={() => join(code)}
                    size="extra-small">Join</PlayfulButton
                  >
                </li>
              {/each}
            </ul>
            {#if $page.data.joinableGames.length > 2}
              <PlayfulButton
                size="extra-small"
                on:click={() => {
                  expandWatchableGames = false
                  expandJoinableGames = !expandJoinableGames
                }}
              >
                {#if !expandJoinableGames}
                  See more
                {:else}
                  Go back
                {/if}
              </PlayfulButton>
            {/if}
          {/if}
        </div>
      {/if}
      {#if !expandJoinableGames}
        <div
          class="flex-1 flex flex-col items-center gap-2 mt-5 px-3 pt-2 pb-3 bg-neutral-800 shadow-frame rounded-lg"
        >
          <span class="self-stretch flex items-center gap-2">
            <Icon class="md:text-xl" icon="fa6-solid:eye" /> Watch ({$page.data.watchableGames
              .length})
          </span>
          {#if $page.data.watchableGames.length === 0}
            <div class="my-auto flex flex-col items-center gap-3">
              <span>No&nbsp;one's&nbsp;playing&nbsp;right&nbsp;now, but&nbsp;you&nbsp;can:</span>
              <PlayfulButton size="extra-small" on:click={() => goto("/createGame")}
                >Create a game</PlayfulButton
              >
            </div>
          {:else}
            <ul class="self-stretch flex-1 flex flex-col gap-2">
              {#each watchableGames as { createdAt, code, playerCount, startedAt, status, subStatus }}
                <li
                  class="flex justify-around items-center py-1.5 bg-neutral-50/5 shadow-frame rounded-l-lg rounded-r-lg"
                >
                  <div class="flex gap-1">
                    <div class="col-span-2 justify-self-center flex items-center gap-0.5">
                      {#each code.slice("") as digit}
                        <span
                          class="w-5 rounded-sm md:rounded-md bg-button-500 text-sh-yellow-500 text-center text-lg px-1 md:py-0.5"
                        >
                          {digit}
                        </span>
                      {/each}
                    </div>
                  </div>
                  <div class="hidden md:flex items-center md:pl-4 md:pr-1.5 text-nowrap">
                    {playerCount} player{playerCount === 1 ? "" : "s"}
                  </div>
                  <div class="hidden md:flex items-center md:pl-1.5 md:pr-4 text-nowrap">
                    {@html timeAgo.format(createdAt, "mini").replace(/ /g, "&nbsp;")} ago
                  </div>
                  <div class="md:hidden flex flex-col gap-1">
                    <span>
                      {playerCount} player{playerCount === 1 ? "" : "s"}
                    </span>
                    <span>
                      {@html timeAgo.format(createdAt, "mini").replace(/ /g, "&nbsp;")} ago
                    </span>
                  </div>
                  <PlayfulButton
                    enabled={!isJoining}
                    extraClasses="text-sm"
                    on:click={() => (showWatchDialog = true)}
                    size="extra-small"
                  >
                    Watch
                  </PlayfulButton>
                </li>
              {/each}
            </ul>
            {#if $page.data.watchableGames.length > 2}
              <PlayfulButton
                size="extra-small"
                on:click={() => {
                  expandJoinableGames = false
                  expandWatchableGames = !expandWatchableGames
                }}
              >
                {#if !expandWatchableGames}
                  See more
                {:else}
                  Go back
                {/if}
              </PlayfulButton>
            {/if}
          {/if}
        </div>
      {/if}
    </div>
  </div>
{/if}
