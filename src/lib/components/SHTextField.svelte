<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { v4 as uuidV4 } from "uuid"

  export let label: string | undefined
  export let placeholder: string | undefined = undefined
  export let type: string | undefined
  export let value: string | undefined

  const dispatch = createEventDispatcher()
  let uuid = uuidV4()

  $: hasLabel = label !== undefined
</script>

<div class="h-14 inline-flex relative">
  <input
    id="shtf-{uuid}"
    placeholder={placeholder ?? " "}
    class="peer block w-full bg-input-500 text-on-input-500 text-opacity-80 placeholder-on-input-500 placeholder-opacity-0 px-4 appearance-none focus:outline-none focus:ring-0"
    class:pt-5={hasLabel}
    class:pb-1={hasLabel}
    class:focus:placeholder-opacity-60={hasLabel}
    class:pt-3={!hasLabel}
    class:pb-3.5={!hasLabel}
    class:placeholder-opacity-60={!hasLabel}
    {...$$restProps}
    bind:value
    on:input={() => {
      if (type === "tel") {
        value = value.trim().replaceAll(/[^+\d]|(?!^)\+/g, "")
      }
      dispatch("input")
    }}
    {...{ type }}
  />
  {#if label}
    <label
      for="shtf-{uuid}"
      class="pointer-events-none absolute left-4 bg-input-500 text-on-input-500 text-opacity-60 transform duration-150 ease-material-standard origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-1 peer-focus:scale-75 top-2 -translate-y-1 scale-75"
      >{label}</label
    >
  {/if}
</div>

<style>
  ::placeholder {
    @apply transition-all duration-150 ease-material-standard;
  }
</style>
