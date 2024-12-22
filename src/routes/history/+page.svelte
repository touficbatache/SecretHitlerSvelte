<script lang="ts">
  import Icon from "@iconify/svelte"

  import { goto } from "$app/navigation"
  import { page } from "$app/stores"
  import * as ApiClient from "$lib/api_client"
  import type { GameplayApiResponse } from "$lib/api_client"
  import { copyToClipboard } from "$lib/clipboard"
  import FloatingWindow from "$lib/components/FloatingWindow.svelte"
  import PaperBack from "$lib/components/PaperBack.svelte"
  import PlayfulButton from "$lib/components/PlayfulButton.svelte"
  import PlayfulIconButton from "$lib/components/PlayfulIconButton.svelte"

  const dateFormatter: Intl.DateTimeFormat = new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    year: "numeric",
  })
  let error: string = ""
  let errorAlertOpen: boolean = false
  let isJoining: boolean = false

  let revealGameCode: boolean = !$page.data.streamerModeEnabled
  let copiedGameCode: string | undefined = undefined

  $: hideGameCode = $page.data.streamerModeEnabled && !revealGameCode

  function camelCaseToWords(s: string) {
    const result: string = s.replace(/([A-Z])/g, " $1")
    return result.charAt(0).toLowerCase() + result.slice(1).toLowerCase()
  }

  function copyGameCode(gameCode: string) {
    copyToClipboard(gameCode, () => {
      copiedGameCode = gameCode
      setTimeout(() => {
        copiedGameCode = undefined
      }, 2000)
    })
  }

  async function join(code: string) {
    error = ""
    isJoining = true
    const response: GameplayApiResponse = await ApiClient.joinGame(code)
    if (response.success) {
      await goto("/waitingRoom")
    }
    if (response.error !== undefined) {
      errorAlertOpen = true
      error = `${response.error.code} - ${response.error.message}`
      isJoining = false
    }
  }
</script>

<div class="w-full h-full flex flex-col">
  <!--  <SimpleButton-->
  <!--    classes="mb-4"-->
  <!--    icon="fa:arrow-left"-->
  <!--  >-->
  <!--    Home-->
  <!--  </SimpleButton>-->

  <div class="relative p-4">
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
          <h3 class="font-eskapade_fraktur text-3xl">Game history</h3>
        </div>
        <h3 class="font-eskapade_fraktur text-3xl text-white">Game history</h3>
      </div>
    </PaperBack>
    <PlayfulIconButton
      extraClasses="h-8 !absolute top-6 left-6 px-2.5 py-2"
      icon="fa:arrow-left"
      on:click={() => window.history.back()}
    />
  </div>

  <div class="flex-1 px-4 overflow-y-auto">
    <!--{#each $page.data.games as { createdAt, code, playerCount, startedAt, status, subStatus }}-->
    <!--  {@const winningTeam = subStatus?.split("gameEnded_")[1]}-->
    <!--  <div-->
    <!--    class="h-20 flex justify-around items-center [&>*]:font-normal"-->
    <!--    class:bg-blue-liberal={winningTeam === "liberal"}-->
    <!--    class:bg-red-fascist={winningTeam === "fascist"}-->
    <!--  >-->
    <!--    <div class="flex items-start gap-1">-->
    <!--      {#each code.split("") as digit}-->
    <!--        <span class="rounded-md bg-button-500 text-sh-yellow-500 px-1.5 py-0.5">{digit}</span>-->
    <!--      {/each}-->
    <!--    </div>-->
    <!--    &lt;!&ndash;        <PinInput&ndash;&gt;-->
    <!--    &lt;!&ndash;          class="!w-fit"&ndash;&gt;-->
    <!--    &lt;!&ndash;          isEnabled={false}&ndash;&gt;-->
    <!--    &lt;!&ndash;          inactiveClass="bg-button-500 text-sh-yellow-500 text-xs"&ndash;&gt;-->
    <!--    &lt;!&ndash;          pin={}&ndash;&gt;-->
    <!--    &lt;!&ndash;        />&ndash;&gt;-->
    <!--    <th>{playerCount}</th>-->
    <!--    {#if winningTeam !== undefined}-->
    <!--      <th>{winningTeam} win </th>-->
    <!--    {:else}-->
    <!--      <th>{status}</th>-->
    <!--    {/if}-->
    <!--    <th>{dateFormatter.format(createdAt).replace("/", "-")}</th>-->
    <!--  </div>-->
    <!--{/each}-->
    <!--    <div class="grid grid-cols-5">-->
    <!--      <span>Game code</span>-->
    <!--      <span>Players</span>-->
    <!--      <span>Status</span>-->
    <!--      <span>Date</span>-->
    <!--      <span />-->
    <!--      {#each $page.data.games as { createdAt, code, playerCount, startedAt, status, subStatus }}-->
    <!--        {@const winningTeam = subStatus?.split("gameEnded_")[1]}-->
    <!--        <td class="h-full flex justify-center items-center gap-1">-->
    <!--          {#each code.split("") as digit}-->
    <!--                <span class="rounded-md bg-button-500 text-sh-yellow-500 text-lg px-2 py-0.5"-->
    <!--                >{digit}</span-->
    <!--                >-->
    <!--          {/each}-->
    <!--        </td>-->
    <!--        <td>{playerCount}</td>-->
    <!--        {#if winningTeam !== undefined}-->
    <!--          <td>{winningTeam} win </td>-->
    <!--        {:else}-->
    <!--          <td>{status}</td>-->
    <!--        {/if}-->
    <!--        <td>{dateFormatter.format(createdAt).replace("/", "-")}</td>-->
    <!--        <td>-->
    <!--          <PlayfulButton size="small">Join</PlayfulButton>-->
    <!--        </td>-->
    <!--      {/each}-->
    <!--    </div>-->
    <table class="w-full h-full table-auto md:text-base">
      <thead>
        <tr>
          <th>Game code</th>
          <th class="hidden md:table-cell">Players</th>
          <th>Status</th>
          <th class="hidden md:table-cell">Date</th>
        </tr>
      </thead>
      <tbody>
        {#each $page.data.games as { createdAt, code, playerCount, startedAt, visibility, status, subStatus }}
          {@const winningTeam = subStatus?.split("gameEnded_")[1]}
          <tr class="h-20 [&>*]:font-normal">
            <td>
              <div class="!hidden md:!flex gap-1 rounded-l-lg">
                {#if visibility === "public"}
                  <div class="mr-2 p-2 bg-green-800 rounded-full">
                    <Icon icon="fa6-solid:tower-broadcast" />
                  </div>
                {/if}
                <div class="col-span-2 justify-self-center flex gap-0.5 md:gap-1">
                  {#each code.split("") as digit}
                    <span
                      class="w-5 md:w-7 rounded-sm md:rounded-md bg-button-500 text-sh-yellow-500 text-center text-lg px-1 md:px-2 md:py-0.5"
                    >
                      {#if !hideGameCode} {digit} {:else} •{/if}
                    </span>
                  {/each}
                </div>
                <div class="h-5 w-0.25 md:mx-2 bg-neutral-700" />
                <PlayfulIconButton
                  colors={{
                    background: "#2c2c2c",
                    backgroundLight: "#2f2f2f",
                    backgroundRaised: "#222222",
                    reflection: "rgba(255, 255, 255, 0.3)",
                    text: "#d1d1d1",
                  }}
                  extraClasses="w-8 h-7 md:w-9 md:h-8 aspect-square justify-self-end"
                  icon={copiedGameCode === code ? "fa:check" : "ion:copy"}
                  on:click={() => copyGameCode(code)}
                />
                {#if $page.data.streamerModeEnabled === true}
                  <PlayfulIconButton
                    colors={{
                      background: "#2c2c2c",
                      backgroundLight: "#2f2f2f",
                      backgroundRaised: "#222222",
                      reflection: "rgba(255, 255, 255, 0.3)",
                      text: "#d1d1d1",
                    }}
                    extraClasses="w-8 h-7 md:w-9 md:h-8 aspect-square justify-self-start"
                    icon="ion:eye-off-sharp"
                    on:mousedown={() => (revealGameCode = true)}
                    on:touchstart={() => (revealGameCode = true)}
                    on:mouseup={() => (revealGameCode = false)}
                    on:touchend={() => (revealGameCode = false)}
                  />
                {/if}
              </div>
              <div class="md:!hidden flex flex-col gap-1 rounded-l-lg">
                <div class="col-span-2 justify-self-center flex gap-0.5 md:gap-1">
                  {#each code.split("") as digit}
                    <span
                      class="w-5 md:w-7 rounded-sm md:rounded-md bg-button-500 text-sh-yellow-500 text-center text-lg px-1 md:px-2 md:py-0.5"
                    >
                      {#if !hideGameCode} {digit} {:else} •{/if}
                    </span>
                  {/each}
                </div>
                <div class="flex gap-2">
                  {#if visibility === "public"}
                    <div class="justify-self-center p-1.5 bg-green-800 rounded-full">
                      <Icon icon="fa6-solid:tower-broadcast" />
                    </div>
                  {/if}
                  <PlayfulIconButton
                    colors={{
                      background: "#2c2c2c",
                      backgroundLight: "#2f2f2f",
                      backgroundRaised: "#222222",
                      reflection: "rgba(255, 255, 255, 0.3)",
                      text: "#d1d1d1",
                    }}
                    extraClasses="w-8 h-7 md:w-9 md:h-8 aspect-square"
                    icon={copiedGameCode === code ? "fa:check" : "ion:copy"}
                    on:click={() => copyGameCode(code)}
                  />
                  {#if $page.data.streamerModeEnabled === true}
                    <PlayfulIconButton
                      colors={{
                        background: "#2c2c2c",
                        backgroundLight: "#2f2f2f",
                        backgroundRaised: "#222222",
                        reflection: "rgba(255, 255, 255, 0.3)",
                        text: "#d1d1d1",
                      }}
                      extraClasses="w-8 h-7 md:w-9 md:h-8 aspect-square"
                      icon="ion:eye-off-sharp"
                      on:mousedown={() => (revealGameCode = true)}
                      on:touchstart={() => (revealGameCode = true)}
                      on:mouseup={() => (revealGameCode = false)}
                      on:touchend={() => (revealGameCode = false)}
                    />
                  {/if}
                </div>
              </div>
            </td>
            <td class="hidden md:table-cell">
              <div>
                {playerCount}
              </div>
            </td>
            <td>
              <div class="text-sm md:text-base">
                <div
                  class="rounded px-2"
                  class:bg-neutral-500={status === "waiting"}
                  class:bg-green-600={status !== "waiting" && winningTeam === undefined}
                  class:bg-blue-liberal={winningTeam === "liberal"}
                  class:bg-red-fascist={winningTeam === "fascist"}
                >
                  {#if winningTeam !== undefined}
                    {winningTeam} win
                  {:else if status !== "waiting"}
                    <span class="hidden md:inline">
                      ongoing:
                      <br />
                      {camelCaseToWords(status)}
                    </span>
                    <span class="md:hidden"> ongoing </span>
                  {:else}
                    not started
                  {/if}
                </div>
              </div>
            </td>
            <td class="hidden md:table-cell">
              <div>
                {dateFormatter.format(createdAt).replace("/", "-")}
              </div>
            </td>
            <td>
              <div class="rounded-r-lg">
                <PlayfulButton
                  enabled={!isJoining}
                  extraClasses="text-sm"
                  on:click={() => join(code)}
                  size="extra-small">Rejoin</PlayfulButton
                >
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<FloatingWindow bind:open={errorAlertOpen}>
  <div class="flex flex-col gap-3 px-10 py-7 shadow-frame bg-[#141414] rounded-lg">
    <span>
      An error occurred: {error}
    </span>

    <PlayfulButton on:click={() => (errorAlertOpen = false)} size="small">Close</PlayfulButton>
  </div>
</FloatingWindow>

<style lang="postcss">
  td {
    @apply h-full px-0 py-2;
  }

  td > div {
    @apply w-full h-full py-3 flex justify-center items-center bg-neutral-50/5 shadow-frame;
  }
</style>
