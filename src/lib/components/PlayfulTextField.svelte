<script lang="ts">
  import { v4 as uuidV4 } from "uuid"

  export let disabled: boolean = false
  export let error: boolean = false
  export let label: string
  export let placeholder: string | undefined = undefined
  export let type: string
  export let value: string
  export let validator: ((value) => string) | undefined = undefined

  let uuid = uuidV4()

  $: if (value && validator !== undefined) {
    value = validator(value)
  }
</script>

<div class="w-full flex flex-col gap-0.5">
  <label for="shtf-{uuid}" class="px-4">{label}</label>
  <input
    id="shtf-{uuid}"
    bind:value
    class="z-20 w-full bg-[#5b5b5b] focus:bg-[#2c2c2c] disabled:bg-[#434343] border-2 border-opacity-50 focus:border-opacity-70 disabled:border-opacity-30 rounded-md text-2xl font-bold text-white text-opacity-70 focus:text-opacity-90 disabled:text-opacity-50 px-4 py-2 outline-none transition-all duration-200 ease-material-deceleration"
    class:border-white={!error}
    class:border-red-500={error}
    {disabled}
    on:input
    {placeholder}
    {...{ type }}
  />
</div>
