<script lang="ts">
  import { quartOut } from "svelte/easing"
  import { fade } from "svelte/transition"

  import { clickOutside } from "$lib/click_outside"

  export let allowDismiss: boolean = true
  export let classes: string = ""
  export let open: boolean = false
</script>

{#if open}
  <div
    class="absolute inset-0 z-max flex justify-center items-center"
    transition:fade={{ duration: 300, easing: quartOut }}
  >
    <div class="-z-10 absolute inset-0 bg-black bg-opacity-60" />
    <div
      class={classes}
      use:clickOutside={allowDismiss ? { callback: () => (open = false) } : undefined}
    >
      <slot />
    </div>
  </div>
{/if}
