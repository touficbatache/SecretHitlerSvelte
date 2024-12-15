<script lang="ts">
  import Icon from "@iconify/svelte"
  import { createEventDispatcher, type EventDispatcher } from "svelte"

  interface Colors {
    background?: string
    backgroundLight?: string
    backgroundRaised?: string
    text?: string
  }

  export let btn: HTMLButtonElement | undefined = undefined
  export let colors: Colors | undefined = undefined
  export let enabled: boolean = true
  export let extraClasses: string | undefined = undefined
  export let icon: string | undefined = undefined
  export let size: "extra-small" | "small" | "normal" = "normal"

  const defaultColors: Colors = {
    background: "#ea6148",
    backgroundLight: "#ef664a",
    backgroundRaised: "#bb612b",
    text: "#fbe1c0",
  }
  const dispatch: EventDispatcher = createEventDispatcher()
</script>

<button
  bind:this={btn}
  class="inline-block z-10 rounded-md py-4 px-8 antialiased text-on-button-500 transition-all duration-200 ease-material-standard enabled:hover:translate-y-0.5 enabled:active:translate-y-[0.3125rem] {extraClasses ??
    ''}"
  class:opacity-60={!enabled}
  class:text-opacity-60={!enabled}
  class:cursor-default={!enabled}
  class:extra-small={size === "extra-small"}
  class:small={size === "small"}
  disabled={!enabled}
  on:click={() => {
    if (enabled) {
      dispatch("click")
    }
  }}
  on:mousedown
  on:mouseup
  {...$$restProps}
  style="--btn-bg-primary: {colors?.background ??
    defaultColors.background}; --btn-bg-secondary: {colors?.backgroundLight ??
    defaultColors.backgroundLight}; --btn-bg-raised: {colors?.backgroundRaised ??
    defaultColors.backgroundRaised}; --btn-text: {colors?.text ?? defaultColors.text};"
>
  <div class="overlay transition-all duration-200 ease-material-standard" />
  <div class="overlay" />

  <span
    class="w-full flex justify-center gap-2 absolute -z-[1] left-1/2 top-[calc(50%+0.5px)] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
    style="-webkit-text-stroke: black 3.2px;"
  >
    {#if icon !== undefined}
      <Icon
        class="text-base overflow-visible text-black my-auto"
        {icon}
        style="stroke: black; stroke-width: 16%; stroke-linecap: round;"
      />
    {/if}

    <slot />
  </span>

  <span class="flex gap-2 justify-center">
    {#if icon !== undefined}
      <Icon class="text-base my-auto" {icon} />
    {/if}

    <slot />
  </span>
</button>

<style lang="postcss">
  button {
    font-size: 24px;
    font-weight: 900;
    color: var(--btn-text);
    letter-spacing: 1px;
    position: relative;
    background: var(--btn-bg-primary);
    box-shadow: 0 5px var(--btn-bg-raised), 0 0 0 1px #241f12, 0px 5px 0px 1px #241f12;
  }
  button:hover:enabled {
    box-shadow: 0 3px var(--btn-bg-raised), 0 0 0 1px #241f12, 0 3px 0 1px #241f12;
  }
  button:active:enabled {
    box-shadow: 0 0 var(--btn-bg-raised), 0 0 0 1px #241f12, 0 0 0 1px #241f12;
  }
  .small {
    @apply text-xl;
    padding: 7px 21px;
  }
  .extra-small {
    @apply text-base;
    padding: 3px 14px;
  }
  button .overlay {
    width: calc(100% - 12px);
    height: calc(100% - 8px);
    position: absolute;
    background: var(--btn-bg-secondary);
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
