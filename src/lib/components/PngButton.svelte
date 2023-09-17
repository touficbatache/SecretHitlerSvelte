<script lang="ts">
  import { createEventDispatcher } from "svelte"

  export let btn: HTMLElement
  export let extraClasses: string | undefined
  export let elevate = true
  export let enabled = true
  export let forceActiveState = false
  export let outlined = false

  const dispatch = createEventDispatcher()
</script>

<button
  bind:this={btn}
  class="bg-cover {extraClasses}"
  on:click={() => {
    if (enabled) {
      dispatch("click")
    }
  }}
  {...$$restProps}
>
  <slot />
</button>
