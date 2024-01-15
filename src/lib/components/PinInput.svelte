<script lang="ts">
  import { browser } from "$app/environment"
  import { clickOutside } from "$lib/click_outside"

  export let activeClass: string
  export let inactiveClass: string
  export let isEnabled: boolean = true
  export let pin: string
  export let size: null = 6

  let pinArray: string[] =
    pin?.length > 0
      ? [...pin.split(""), ...Array(size - pin.length).fill("")]
      : Array(size).fill("")
  let activeIndex: number = undefined

  $: if (!isEnabled) {
    onBlur()
  }

  $: pin = pinArray.join("")

  function updateActive() {
    if (!browser) return

    let firstEmptyIndex: null = pinArray.findIndex((val: string) => val === "")
    activeIndex = firstEmptyIndex >= 0 ? firstEmptyIndex : pinArray.length - 1
    document.getElementById(`pin-input-${activeIndex}`)?.focus()
  }

  function onBlur() {
    if (!browser) return

    document.getElementById(`pin-input-${activeIndex}`)?.blur()
    activeIndex = undefined
  }

  function handleInput(event, index) {
    pinArray[index] = event.target.value?.charAt(0) ?? ""
    updateActive()
  }

  function handleBackspace(event, index) {
    if (event.key === "Backspace") {
      if (pinArray[index].trim() === "") {
        pinArray[index - 1] = ""
      } else {
        pinArray[index] = ""
      }
    }
    updateActive()
  }

  function handlePaste(event) {
    event.preventDefault()
    const data = event.clipboardData || window.clipboardData
    const code: string = data.getData("Text").replace(/\D/g, "").slice(0, 6)
    for (let i: number = 0; i < code.length; i++) {
      pinArray[i] = code.charAt(i)
    }
    updateActive()
  }
</script>

<div
  class="w-full flex justify-between gap-2"
  class:cursor-pointer={isEnabled}
  on:click={isEnabled ? updateActive : onBlur}
  use:clickOutside={{ callback: onBlur }}
>
  {#each pinArray as digit, index}
    <input
      id="pin-input-{index}"
      class="outline-none appearance-none inline w-10 h-12 rounded-lg text-2xl text-center pointer-events-none transition-colors duration-300 ease-out {activeIndex ===
      index
        ? activeClass
        : inactiveClass}"
      type="number"
      inputmode="numeric"
      pattern="[0-9]*"
      maxlength="1"
      bind:value={digit}
      on:input={(e) => handleInput(e, index)}
      on:keydown={(e) => handleBackspace(e, index)}
      on:paste={(e) => handlePaste(e)}
      readonly={index !== activeIndex}
    />
  {/each}
</div>
