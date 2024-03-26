<script lang="ts">
  import Icon from "@iconify/svelte"

  export let classes: string = ""
  export let compact: boolean = true
  export let mobileIconOnly: boolean = false
  export let disabled: boolean = false
  export let icon: string | undefined = undefined
</script>

<button
  class="flex justify-center items-center md:px-4 rounded-md bg-white bg-opacity-10 enabled:hover:bg-opacity-20 enabled:active:bg-opacity-30 disabled:bg-opacity-10 border-2 border-white border-opacity-40 enabled:hover:border-opacity-60 enabled:active:border-opacity-60 disabled:border-opacity-20 text-white text-opacity-80 enabled:hover:text-opacity-90 enabled:active:text-opacity-90 disabled:text-opacity-30 transition duration-200 ease-material-deceleration {classes}"
  class:px-4={!mobileIconOnly}
  class:px-2={mobileIconOnly}
  class:w-full={!compact}
  class:py-1={compact}
  class:py-3={!compact}
  class:gap-2={compact}
  class:gap-3={!compact}
  {disabled}
  on:click
  {...$$restProps}
>
  {#if icon}
    <span class:text-xl={!compact}>
      <Icon {icon} />
    </span>
  {/if}
  <span
    class="font-bold pt-0.5"
    class:text-lg={compact}
    class:text-2xl={!compact}
    class:hidden={mobileIconOnly}
    class:md:inline={mobileIconOnly}
  >
    <slot />
  </span>
</button>
