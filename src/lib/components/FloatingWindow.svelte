<script lang="ts">
  import { browser } from "$app/environment"

  export let alwaysShowOnMobile = false
  export let allowDismiss = true
  export let isOpen = false

  const id = "backgroundClickCatcher"

  const eventListener = () => (isOpen = false)

  const timeout = () => {
    document.getElementById(id)?.classList.remove("fixed")
  }

  $: if (browser) {
    if (isOpen) {
      clearTimeout(timeout)
      document.getElementById(id)?.classList.remove("opacity-0")
      document.getElementById(id)?.classList.add("fixed", "opacity-100")
      if (allowDismiss) {
        document.getElementById(id)?.addEventListener("click", eventListener)
      }
    } else {
      document.getElementById(id)?.classList.add("opacity-0")
      document.getElementById(id)?.classList.remove("opacity-100")
      setTimeout(timeout, 150)
      if (allowDismiss) {
        document.getElementById(id)?.removeEventListener("click", eventListener)
      }
    }
  }
</script>

{#if !alwaysShowOnMobile}
  <div class="z-[9999] transition-opacity" class:opacity-0={!isOpen} class:opacity-1={isOpen}>
    <slot />
  </div>
{:else}
  <div class="z-[9999] transition-opacity" class:md:opacity-0={!isOpen} class:md:opacity-1={isOpen}>
    <slot />
  </div>
{/if}
