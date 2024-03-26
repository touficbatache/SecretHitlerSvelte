<script lang="ts">
  import { onMount } from "svelte"

  export let value: string

  let textarea: HTMLElement

  onMount(() => {
    textarea.select()
    document.execCommand("copy")
  })
</script>

<textarea bind:this={textarea} bind:value />
