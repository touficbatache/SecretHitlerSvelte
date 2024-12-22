<script lang="ts">
  import { onMount } from "svelte"

  import { goto } from "$app/navigation"
  import { page } from "$app/stores"
  import ElevatedText from "$lib/components/ElevatedText.svelte"
  import PlayfulSpinner from "$lib/components/PlayfulSpinner.svelte"

  onMount(() => {
    if ($page.data.gameCode === undefined) {
      goto("/", { replaceState: true })
    } else {
      setTimeout(() => goto("/waitingRoom", { replaceState: true }), 3000)
    }
  })
</script>

<div class="w-full h-full flex flex-col justify-center items-center gap-5 px-6">
  <PlayfulSpinner color="#fff" />

  <ElevatedText class="text-xl md:text-2xl text-center" weight="extrabold">
    You're already in a game
    <br />
    Reconnecting...
  </ElevatedText>
</div>
