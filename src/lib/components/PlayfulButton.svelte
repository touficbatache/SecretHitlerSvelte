<script lang="ts">
  import { createEventDispatcher } from "svelte"

  export let btn: HTMLElement
  export let extraClasses: string | undefined
  export let enabled = true
  export let forceActiveState = false
  export let small = false

  const dispatch = createEventDispatcher()
</script>

<button
  bind:this={btn}
  class="z-10 rounded py-4 px-8 antialiased text-on-button-500 transition-all duration-200 ease-material-standard {extraClasses ??
    ''}"
  class:opacity-60={!enabled}
  class:text-opacity-60={!enabled}
  class:cursor-default={!enabled}
  class:enabled
  class:forceActiveState
  class:small
  on:click={() => {
    if (enabled) {
      dispatch("click")
    }
  }}
  {...$$restProps}
>
  <div class="overlay" />
  <div class="overlay" />

  <!--  <svg viewBox="0 0 100 4" xmlns="http://www.w3.org/2000/svg" class="s-OdUXF-bzy5xc" style="width: 100%; height: 100%;"><style class="s-OdUXF-bzy5xc">.Rrrrr {-->
  <!--    font: 9px Museo;-->
  <!--    fill: #fbe1c0;-->
  <!--    paint-order: stroke;-->
  <!--    stroke: #000000;-->
  <!--    stroke-width: 2px;-->
  <!--    stroke-dasharray: 0,50,150;-->
  <!--    stroke-linecap: square;-->
  <!--    stroke-linejoin: miter;-->
  <!--  }</style><text x="15" y="6" class="Rrrrr s-OdUXF-bzy5xc">Pass &amp; Play</text></svg>-->

  <span
    class="w-full absolute -z-[1] left-1/2 top-[calc(50%+0.5px)] -translate-x-1/2 -translate-y-1/2"
    style="-webkit-text-stroke: black 3.2px;"
  >
    <slot />
  </span>

  <slot />
</button>

<style lang="postcss">
  button {
    border: none;
    font-size: 24px;
    font-weight: 900;
    color: #fbe1c0;
    border-radius: 6px;
    background: none;
    cursor: pointer;
    padding: 14px 0;
    display: inline-block;
    letter-spacing: 1px;
    outline: none;
    position: relative;
    transition: all 0.2s;
    background: #ea6148;
    box-shadow: 0 5px #bb612b, 0 0 0 1px #241f12, 0px 5px 0px 1px #241f12;
    @apply font-museo;
  }
  .small {
    font-size: 20px;
    padding: 7px 21px;
  }
  button:hover {
    box-shadow: 0 3px #bb612b, 0 0 0 1px #241f12, 0 3px 0 1px #241f12;
    transform: translateY(2px);
  }
  button:active {
    box-shadow: 0 0px #bb612b, 0 0 0 1px #241f12, 0 0 0 1px #241f12;
    transform: translateY(5px);
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
