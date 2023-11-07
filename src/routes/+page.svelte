<script lang="ts">
  import { goto } from "$app/navigation"
  import { page } from "$app/stores"
  import Logo from "$lib/components/Logo.svelte"
  import PlayfulButton from "$lib/components/PlayfulButton.svelte"
  import PlayfulIconButton from "$lib/components/PlayfulIconButton.svelte"
  import { signOut } from "$lib/firebase"
</script>

<div class="relative w-full h-full">
  <div class="absolute right-0">
    <PlayfulIconButton
      extraClasses="w-10 h-[36px] m-4 aspect-square"
      icon="fa:sign-out"
      on:click={signOut}
    />
  </div>

  <div class="absolute inset-0 px-12 py-36 md:py-24 flex flex-col md:flex-row justify-between">
    <Logo />

    <!--{#if $page.data.user}-->
    <!--  <span>Welcome {$page.data.user.name}</span>-->

    <!--  <button on:click={() => goto("/logout")}>Logout</button>-->
    <!--{/if}-->

    <div class="w-full flex flex-col items-center gap-8 p-8">
      <!--      <SHButton extraClasses="w-full" on:click={() => goto("/createGame")}>Create game</SHButton>-->
      <!--      <PlayfulButton extraClasses="w-full" on:click={() => goto("/createGame")}>Pass & Play</PlayfulButton>-->
      <!--      <SHButton extraClasses="w-full" on:click={() => goto("/joinGame")}>Join game</SHButton>-->
      <input
        class="w-full bg-white bg-opacity-30 focus:bg-opacity-10 border-2 border-white border-opacity-50 focus:border-opacity-70 rounded-md text-2xl font-bold px-4 py-2 outline-none transition duration-200 ease-material-deceleration"
        value={$page.data.user?.name}
      />
      <PlayfulButton extraClasses="w-full" on:click={() => goto("/createGame")}>
        Create game
      </PlayfulButton>
      <PlayfulButton extraClasses="w-full" on:click={() => goto("/joinGame")}>
        Join game
      </PlayfulButton>
      <!--      <PngButton extraClasses="bg-btn-create-game w-full aspect-[288/86]" on:click={() => goto("/createGame")}></PngButton>-->
      <!--      <PngButton extraClasses="bg-btn-join-game w-full aspect-[288/86]" on:click={() => goto("/joinGame")}></PngButton>-->
    </div>
  </div>

  {#if $page.data.user?.name !== undefined}
    <span class="absolute inset-x-0 bottom-0 text-center m-4">
      Signed in as {$page.data.user?.name}
    </span>
  {/if}
</div>
