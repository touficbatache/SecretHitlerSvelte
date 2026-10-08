<script lang="ts">
  import { onMount } from "svelte"

  import { signOut } from "$lib/firebase"

  // The Firebase client only exists in the browser, so this can't run while rendering on the server
  onMount(() => signOut())
</script>
