<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { quartOut } from "svelte/easing"
  import { fade } from "svelte/transition"

  import { clickOutside } from "$lib/click_outside"
  import SimpleButton from "$lib/components/SimpleButton.svelte"

  export let allowDismiss: boolean = true
  export let allowMinimize: boolean = false
  export let classes: string = ""
  export let open: boolean = false

  const dispatch = createEventDispatcher()
</script>

{#if open}
  <div
    class="absolute inset-0 z-max flex justify-center items-center"
    transition:fade={{ duration: 300, easing: quartOut }}
  >
    <div class="-z-10 absolute inset-0 bg-black bg-opacity-60" />
    <div
      class="relative {classes}"
      use:clickOutside={allowDismiss ? { callback: () => (open = false) } : undefined}
    >
      {#if allowMinimize}
        <SimpleButton
          classes="absolute left-10 top-4"
          icon="fa:window-restore"
          mobileIconOnly={true}
          on:click={() => dispatch("minimize")}
          small={true}
        >
          Minimize
        </SimpleButton>
      {/if}
      <slot />
    </div>
  </div>
{/if}
