<script lang="ts">
  import { backInOut } from "svelte/easing"
  import { scale } from "svelte/transition"

  import { goto } from "$app/navigation"
  import { page } from "$app/stores"
  import * as ApiClient from "$lib/api_client"
  import { clickOutside } from "$lib/click_outside"
  import Logo from "$lib/components/Logo.svelte"
  import PlayfulButton from "$lib/components/PlayfulButton.svelte"
  import SimpleIconButton from "$lib/components/SimpleIconButton.svelte"
  import TwoPaneView from "$lib/components/TwoPaneView.svelte"
  import { setUserName, signOut } from "$lib/firebase"

  let btnMenu: HTMLButtonElement
  let inputName: string | undefined = $page.data.user?.name
  let isUpdatingUserName: boolean = false
  let isMenuOpen: boolean = false

  $: hasModifiedName = inputName !== $page.data.user?.name
  $: if (!hasModifiedName) {
    isUpdatingUserName = false
  }
</script>

<div class="relative w-full h-full">
  <div class="absolute right-0 flex items-start">
    <!--    <PlayfulIconButton-->
    <!--      extraClasses="w-10 h-[36px] m-4 aspect-square"-->
    <!--      icon="fa:sign-out"-->
    <!--      on:click={signOut}-->
    <!--    />-->
    <!--    <PlayfulIconButton extraClasses="w-10 h-[36px] m-4 aspect-square" icon="fa:bars" />-->
    {#if isMenuOpen}
      <div
        class="relative z-50 flex flex-col gap-4 mt-3.5 py-4 px-3 bg-neutral-800 shadow-frame rounded-lg"
        transition:scale={{ duration: 200, easing: backInOut, start: 0.9 }}
        use:clickOutside={{ callback: () => (isMenuOpen = false), excluded: [btnMenu] }}
      >
        <PlayfulButton icon="fa:th-list" on:click={() => goto("/history")} size="small"
          >Game history</PlayfulButton
        >
        <PlayfulButton
          colors={!$page.data.streamerModeEnabled
            ? {
                background: "#2c2c2c",
                backgroundLight: "#2f2f2f",
                backgroundRaised: "#222222",
                text: "#afafaf",
              }
            : {
                background: "#ea6148",
                backgroundLight: "#ef664a",
                backgroundRaised: "#bb612b",
                text: "#fbe1c0",
              }}
          icon="fa:video-camera"
          on:click={() => ApiClient.setStreamerMode(!$page.data.streamerModeEnabled)}
          size="small"
          >Streamer mode: {!$page.data.streamerModeEnabled ? "off" : "on"}</PlayfulButton
        >
        <div class="h-0.25 mt-1 mx-2 bg-neutral-50/30" />
        <PlayfulButton icon="fa:sign-out" on:click={signOut} size="small">Sign out</PlayfulButton>
      </div>
    {/if}
    <SimpleIconButton
      bind:btn={btnMenu}
      classes="m-4"
      icon="fa:bars"
      on:click={() => (isMenuOpen = !isMenuOpen)}
    />
  </div>

  <TwoPaneView class="h-full py-24 md:px-12">
    <div class="w-full h-full flex items-center px-6" slot="first">
      <Logo />
    </div>

    <div
      class="w-full h-full flex flex-col justify-end gap-16 md:justify-around md:gap-5 items-center px-10"
      slot="second"
    >
      <!--      <div class="w-full flex flex-col bg-white bg-opacity-30 focus:bg-opacity-10 border-2 border-white border-opacity-50 focus:border-opacity-70 rounded-md px-4 py-2 transition duration-200 ease-material-deceleration">-->
      <!--        <span>Your nickname</span>-->
      <!--        <input-->
      <!--          class="bg-transparent text-2xl font-bold outline-none"-->
      <!--          value={$page.data.user?.name}-->
      <!--        />-->
      <!--      </div>-->

      <div class="w-full flex flex-col gap-0.5">
        <span class="px-4">Your nickname</span>
        <div class="relative w-full flex gap-3">
          <input
            bind:value={inputName}
            class="z-20 w-full bg-[#5b5b5b] focus:bg-[#2c2c2c] disabled:bg-[#434343] border-2 border-opacity-50 focus:border-opacity-70 disabled:border-opacity-30 rounded-md text-2xl font-bold text-white text-opacity-70 focus:text-opacity-90 disabled:text-opacity-50 px-4 py-2 outline-none transition-all duration-200 ease-material-deceleration"
            class:mr-32={hasModifiedName && inputName?.length > 0}
            class:mr-16={hasModifiedName && inputName?.length === 0}
            class:border-white={inputName?.length > 0}
            class:border-red-500={inputName?.length === 0}
            disabled={isUpdatingUserName}
            on:input={() => {
              inputName = inputName
                .toLowerCase()
                .replace(/[^a-z]+/g, "")
                .slice(0, 10)
            }}
          />
          <button
            class="z-10 absolute flex justify-center items-center w-[52px] h-[52px] aspect-square bg-[#5b5b5b] enabled:hover:bg-[#2c2c2c] disabled:bg-[#434343] border-2 border-white border-opacity-50 enabled:hover:border-opacity-70 disabled:border-opacity-30 text-white text-opacity-90 disabled:text-opacity-50 rounded-md transition-all duration-200 ease-material-deceleration"
            class:right-16={inputName?.length > 0}
            class:right-0={inputName?.length === 0}
            disabled={isUpdatingUserName}
            on:click={() => (inputName = $page.data.user?.name)}
          >
            <iconify-icon icon="fa:undo" />
          </button>
          <button
            class="absolute right-0 flex justify-center items-center w-[52px] h-[52px] aspect-square bg-white bg-opacity-30 enabled:hover:bg-opacity-10 disabled:bg-opacity-20 border-2 border-white border-opacity-50 enabled:hover:border-opacity-70 disabled:border-opacity-30 text-white text-opacity-90 disabled:text-opacity-50 rounded-md transition duration-200 ease-material-deceleration"
            disabled={inputName?.length === 0 || isUpdatingUserName}
            on:click={() => {
              setUserName(inputName)
              isUpdatingUserName = true
            }}
          >
            <iconify-icon icon="fa:check" />
          </button>
          <!--          <PlayfulIconButton-->
          <!--            extraClasses="w-[48px] h-[48px] aspect-square"-->
          <!--            icon="fa:check"-->
          <!--          />-->
        </div>
      </div>
      <div class="w-full flex flex-col gap-5">
        <PlayfulButton extraClasses="w-full" on:click={() => goto("/createGame")}>
          Create game
        </PlayfulButton>
        <PlayfulButton extraClasses="w-full" on:click={() => goto("/joinGame")}>
          Join game
        </PlayfulButton>
      </div>
    </div>
  </TwoPaneView>

  <!--{#if $page.data.user?.name !== undefined}-->
  <!--  <span class="absolute inset-x-0 bottom-0 text-center m-4">-->
  <!--    Signed in as {$page.data.user?.name}-->
  <!--  </span>-->
  <!--{/if}-->
</div>
