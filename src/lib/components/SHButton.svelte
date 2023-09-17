<script lang="ts">
  import { createEventDispatcher } from "svelte"

  export let btn: HTMLElement | undefined
  export let extraClasses: string | undefined
  export let elevate = true
  export let enabled = true
  export let forceActiveState = false
  export let outlined = false

  const dispatch = createEventDispatcher()
</script>

<button
  bind:this={btn}
  class="rounded py-4 px-8 flex justify-center items-center text-on-button-500 transition-all duration-200 ease-material-standard {extraClasses ??
    ''}"
  class:opacity-60={!enabled}
  class:text-opacity-60={!enabled}
  class:cursor-default={!enabled}
  class:filled={!outlined}
  class:outlined
  class:enabled
  class:elevate
  class:forceActiveState
  on:click={() => {
    if (enabled) {
      dispatch("click")
    }
  }}
  {...$$restProps}
>
  <slot />
</button>

<style lang="postcss">
  .outlined {
    @apply border border-white border-opacity-50;
  }
  .outlined.enabled {
    @apply hover:bg-white hover:bg-opacity-20 active:bg-white active:bg-opacity-40;
  }
  .outlined.forceActiveState {
    @apply bg-white bg-opacity-40;
  }

  .filled {
    @apply bg-button-500;
  }
  .filled.enabled {
    @apply hover:bg-button-400 active:bg-button-300;
    box-shadow: inset 0px 1px 1px 0px rgb(255 255 255 / 20%);
  }
  .filled.forceActiveState {
    @apply bg-button-300;
  }

  .enabled.elevate {
    @apply hover:shadow-xl hover:shadow-white/10 active:shadow-xl active:shadow-white/10;
  }
  .forceActiveState.elevate {
    @apply shadow-xl shadow-white/10;
  }
</style>
