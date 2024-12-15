<script lang="ts">
  import Icon from "@iconify/svelte"

  import type { PlayfulButtonColors } from "$lib/buttons"

  export let btn: HTMLButtonElement | undefined = undefined
  export let colors: PlayfulButtonColors | undefined = undefined
  export let disabled: boolean = false
  export let extraClasses: string | undefined = undefined
  export let icon: string
  export let iconClasses: string | undefined = undefined

  const defaultColors: Required<PlayfulButtonColors> = {
    background: "#ea6148",
    backgroundLight: "#ef664a",
    backgroundRaised: "#bb612b",
    reflection: "rgba(255, 255, 255, 0.75)",
    text: "#fbe1c0",
  }
</script>

<button
  bind:this={btn}
  class="z-10 rounded antialiased text-on-button-500 transition-all duration-200 ease-material-standard enabled:hover:translate-y-[0.0625rem] enabled:active:translate-y-[0.1875rem] {extraClasses ??
    ''}"
  class:opacity-60={disabled}
  class:text-opacity-60={disabled}
  class:cursor-default={disabled}
  {disabled}
  on:click
  on:mousedown
  on:touchstart
  on:mouseup
  on:touchend
  {...$$restProps}
  style="--btn-bg-primary: {colors?.background ??
    defaultColors.background}; --btn-bg-secondary: {colors?.backgroundLight ??
    defaultColors.backgroundLight}; --btn-bg-raised: {colors?.backgroundRaised ??
    defaultColors.backgroundRaised}; --btn-reflection: {colors?.reflection ??
    defaultColors.reflection}; --btn-text: {colors?.text ?? defaultColors.text};"
>
  <div class="overlay" />
  <div class="overlay" />

  <span
    class="w-full absolute -z-[1] left-1/2 top-[calc(50%+.7px)] -translate-x-1/2 -translate-y-1/2"
  >
    <Icon
      class="text-base m-auto {iconClasses} !overflow-visible !text-black"
      {icon}
      style="stroke: black; stroke-width: 12.5%; stroke-linecap: round;"
    />
  </span>

  <Icon class="text-base m-auto {iconClasses}" {icon} />
</button>

<style lang="postcss">
  button {
    border: none;
    font-size: 24px;
    font-weight: 900;
    color: var(--btn-text);
    border-radius: 10%;
    display: inline-block;
    letter-spacing: 1px;
    outline: none;
    position: relative;
    background: var(--btn-bg-primary);
    box-shadow: 0 3px var(--btn-bg-raised), 0 0 0 1px #241f12, 0px 3px 0px 1px #241f12;
  }
  button:hover:enabled {
    box-shadow: 0 2px var(--btn-bg-raised), 0 0 0 1px #241f12, 0 2px 0 1px #241f12;
  }
  button:active:enabled {
    box-shadow: 0 0 var(--btn-bg-raised), 0 0 0 1px #241f12, 0 0 0 1px #241f12;
  }
  button .overlay {
    width: -webkit-fill-available;
    height: -webkit-fill-available;
    position: absolute;
    background: var(--btn-bg-secondary);
    box-shadow: 0px 1px 1px 1px rgba(0, 0, 0, 0.06);
    border-radius: 8%;
    top: 0px;
    left: 0;
    margin: 6% 7%;
    z-index: -1;
  }
  button .overlay + .overlay {
    width: 6%;
    height: 10%;
    background: var(--btn-reflection);
    border-radius: 100%;
    right: 1px;
    top: -0.5px;
    left: auto;
    transform: rotate(-55deg);
    filter: blur(0.2px);
    box-shadow: none;
  }
</style>
