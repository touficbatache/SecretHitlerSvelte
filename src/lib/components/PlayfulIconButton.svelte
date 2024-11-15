<script lang="ts">
  import Icon from "@iconify/svelte"

  export let btn: HTMLButtonElement | undefined = undefined
  export let disabled: boolean = false
  export let extraClasses: string | undefined
  export let icon: string | undefined
</script>

<button
  bind:this={btn}
  class="z-10 rounded antialiased text-on-button-500 transition-all duration-200 ease-material-standard shadow-icon-button-resting enabled:hover:shadow-icon-button-hover enabled:hover:translate-y-[0.0625rem] enabled:active:shadow-icon-button-active enabled:active:translate-y-[0.1875rem] {extraClasses ??
    ''}"
  class:opacity-60={disabled}
  class:text-opacity-60={disabled}
  class:cursor-default={disabled}
  {disabled}
  on:click
  {...$$restProps}
>
  <div class="overlay" />
  <div class="overlay" />

  <span
    class="w-full absolute -z-[1] left-1/2 top-[calc(50%+.7px)] -translate-x-1/2 -translate-y-1/2"
  >
    <Icon
      class="text-base overflow-visible text-black m-auto"
      {icon}
      style="stroke: black; stroke-width: 12em; stroke-linecap: round;"
    />
  </span>

  <Icon class="text-base m-auto" {icon} />
</button>

<style lang="postcss">
  button {
    border: none;
    font-size: 24px;
    font-weight: 900;
    color: #fbe1c0;
    border-radius: 10%;
    background: none;
    display: inline-block;
    letter-spacing: 1px;
    outline: none;
    position: relative;
    transition: all 0.2s;
    background: #ea6148;
    @apply font-museo;
  }
  button .overlay {
    width: -webkit-fill-available;
    height: -webkit-fill-available;
    position: absolute;
    background: #ef664a;
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
