<script lang="ts">
  import { onMount } from "svelte"

  export let value: string

  let textarea: HTMLTextAreaElement

  onMount(() => {
    textarea.select()
    document.execCommand("copy")
  })
</script>

<textarea bind:this={textarea} bind:value />
