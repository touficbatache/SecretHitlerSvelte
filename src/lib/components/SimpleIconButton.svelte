<script lang="ts">
  import Icon from "@iconify/svelte"

  export let btn: HTMLButtonElement | undefined = undefined
  export let classes: string = ""
  export let disabled: boolean = false
  export let icon: string
</script>

<button
  bind:this={btn}
  class="relative z-10 flex justify-center items-center p-2.5 rounded-md bg-white bg-opacity-10 enabled:hover:bg-opacity-20 enabled:active:bg-opacity-30 disabled:bg-opacity-10 border-2 border-white border-opacity-40 enabled:hover:border-opacity-60 enabled:active:border-opacity-60 disabled:border-opacity-20 text-white text-opacity-80 enabled:hover:text-opacity-90 enabled:active:text-opacity-90 disabled:text-opacity-30 transition duration-200 ease-material-deceleration {classes}"
  {disabled}
  on:click
  {...$$restProps}
>
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
