<script lang="ts">
  import { onMount } from "svelte"

  import { goto } from "$app/navigation"
  import { page } from "$app/stores"
  import PlayfulSpinner from "$lib/components/PlayfulSpinner.svelte"
  import Spinner from "$lib/components/Spinner.svelte"

  onMount(() => {
    if ($page.data.gameCode === undefined) {
      goto("/")
    } else {
      setTimeout(() => goto("/waitingRoom"), 3000)
    }
  })
</script>

<div class="w-full h-full px-6 flex flex-col justify-evenly items-center">
  <div class="w-full flex flex-col items-center gap-5">
<!--    <div class="w-10 h-10">-->
<!--      <Spinner color="#fff" />-->
<!--    </div>-->

    <PlayfulSpinner color="#fff" />

    <span class="text-xl text-center">
      You're already in a game
      <br />
      Reconnecting...
    </span>
  </div>
</div>
