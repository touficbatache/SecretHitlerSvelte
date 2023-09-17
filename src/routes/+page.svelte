<script lang="ts">
  import { goto } from "$app/navigation"
  import Logo from "$lib/components/Logo.svelte"
  import PlayfulButton from "$lib/components/PlayfulButton.svelte"
  import PlayfulIconButton from "$lib/components/PlayfulIconButton.svelte"
  import PlayfulSpinner from "$lib/components/PlayfulSpinner.svelte"
  import { signOut } from "$lib/firebase"
</script>

<div class="w-full h-full flex flex-col">
  <div class="flex justify-end z-10">
    <PlayfulIconButton
      extraClasses="w-10 h-[36px] m-4 aspect-square"
      icon="fa:sign-out"
      on:click={signOut}
    />
    <!--        <PngButton extraClasses="bg-btn-logout w-10 m-4 aspect-square" on:click={signOut}></PngButton>-->
    <!--        <button-->
    <!--          class="h-fit flex p-3 m-2 rounded-full hover:bg-white hover:bg-opacity-10 active:bg-white active:bg-opacity-20 transition-all duration-100 ease-material-standard"-->
    <!--          on:click={signOut}-->
    <!--        >-->
    <!--          <iconify-icon class="text-2xl" icon="material-symbols:logout" />-->
    <!--        </button>-->
  </div>

  <div class="absolute w-full h-full px-12 py-36 md:py-24 flex flex-col justify-between">
    <Logo />

    <!--{#if $page.data.user}-->
    <!--  <span>Welcome {$page.data.user.name}</span>-->

    <!--  <button on:click={() => goto("/logout")}>Logout</button>-->
    <!--{/if}-->

    <div class="w-full flex flex-col items-center gap-8 p-8">
      <!--      <SHButton extraClasses="w-full" on:click={() => goto("/createGame")}>Create game</SHButton>-->
      <!--      <PlayfulButton extraClasses="w-full" on:click={() => goto("/createGame")}>Pass & Play</PlayfulButton>-->
      <!--      <SHButton extraClasses="w-full" on:click={() => goto("/joinGame")}>Join game</SHButton>-->
      <PlayfulButton extraClasses="w-full" on:click={() => goto("/createGame")}>
        Create game
      </PlayfulButton>
      <PlayfulButton extraClasses="w-full" on:click={() => goto("/joinGame")}>
        Join game
      </PlayfulButton>
      <!--      <PngButton extraClasses="bg-btn-create-game w-full aspect-[288/86]" on:click={() => goto("/createGame")}></PngButton>-->
      <!--      <PngButton extraClasses="bg-btn-join-game w-full aspect-[288/86]" on:click={() => goto("/joinGame")}></PngButton>-->
    </div>

    <!--{#if $page.data.gameCode !== undefined}-->
    <!--  <SHButton-->
    <!--    extraClasses="w-full"-->
    <!--    on:click={async () => {-->
    <!--      await ApiClient.leaveGame()-->
    <!--    }}>..temp&nbsp;already&nbsp;in.. LEAVE</SHButton-->
    <!--  >-->
    <!--{/if}-->
  </div>
</div>
