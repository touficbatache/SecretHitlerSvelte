<script lang="ts">
  import Icon from "@iconify/svelte"
  import { createEventDispatcher, type EventDispatcher } from "svelte"

  export let btn: HTMLElement | undefined = undefined
  export let extraClasses: string | undefined
  export let enabled: boolean = true
  export let forceActiveState: boolean = false
  export let icon: string | undefined = undefined
  export let small: boolean = false

  const dispatch: EventDispatcher = createEventDispatcher()
</script>

<button
  bind:this={btn}
  class="inline-block z-10 rounded py-4 px-8 antialiased text-on-button-500 transition-all duration-200 ease-material-standard shadow-button-resting enabled:hover:shadow-button-hover enabled:hover:translate-y-0.5 enabled:active:shadow-button-active enabled:active:translate-y-[0.3125rem] {extraClasses ??
    ''}"
  class:opacity-60={!enabled}
  class:text-opacity-60={!enabled}
  class:cursor-default={!enabled}
  class:enabled
  class:forceActiveState
  class:small
  disabled={!enabled}
  on:click={() => {
    if (enabled) {
      dispatch("click")
    }
  }}
  {...$$restProps}
>
  <div class="overlay" />
  <div class="overlay" />

  <span
    class="w-full flex justify-center gap-2 absolute -z-[1] left-1/2 top-[calc(50%+0.5px)] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
    style="-webkit-text-stroke: black 3.2px;"
  >
    {#if icon !== undefined}
      <Icon
        class="text-base overflow-visible text-black my-auto"
        {icon}
        style="stroke: black; stroke-width: 16em; stroke-linecap: round;"
      />
    {/if}

    <slot />
  </span>

  <span class="flex gap-2 justify-center">
    <Icon class="text-base m-auto" {icon} />

    <slot />
  </span>
</button>

<style lang="postcss">
  button {
    border: none;
    font-size: 24px;
    font-weight: 900;
    color: #fbe1c0;
    border-radius: 6px;
    background: none;
    padding: 14px 0;
    letter-spacing: 1px;
    outline: none;
    position: relative;
    transition: all 0.2s;
    background: #ea6148;
    /*@apply font-museo;*/
  }
  .small {
    @apply text-xl;
    padding: 7px 21px;
  }
  button .overlay {
    width: -webkit-fill-available;
    height: -webkit-fill-available;
    position: absolute;
    background: #ef664a;
    box-shadow: 0px 1px 1px 1px rgba(0, 0, 0, 0.06);
    border-radius: 4px;
    top: 0px;
    left: 0;
    margin: 4px 6px;
    z-index: -1;
  }
  button .overlay + .overlay {
    width: 4px;
    height: 6px;
    background: rgba(255, 255, 255, 0.75);
    border-radius: 100%;
    right: 1px;
    top: -0.5px;
    left: auto;
    transform: rotate(-55deg);
    filter: blur(0.2px);
    box-shadow: none;
  }
</style>
