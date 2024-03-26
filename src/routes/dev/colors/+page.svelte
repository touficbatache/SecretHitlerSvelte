<script lang="ts">
  import CopyClipboard from "$lib/components/CopyClipboard.svelte"

  let hexCode: string | undefined
  let inputHexCode: string | undefined
  $: hexCode =
    inputHexCode?.length === 6 && /^[0-9A-F]{6}$/i.test(inputHexCode) ? inputHexCode : undefined

  function componentToHex(c) {
    const hex = c.toString(16)
    return hex.length == 1 ? "0" + hex : hex
  }

  function rgbToHex(rgb) {
    return "#" + componentToHex(rgb.r) + componentToHex(rgb.g) + componentToHex(rgb.b)
  }

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null
  }

  function getComponentTint(c, tint) {
    return c + Math.round((255 - c) * tint)
  }

  function getComponentShade(c, shade) {
    return Math.round(c * shade)
  }

  function getHexTintOrShade(hex, factor, isTint) {
    let rgb = hexToRgb(hex)

    if (!rgb) return

    let r = isTint ? getComponentTint(rgb.r, factor) : getComponentShade(rgb.r, factor)
    let g = isTint ? getComponentTint(rgb.g, factor) : getComponentShade(rgb.g, factor)
    let b = isTint ? getComponentTint(rgb.b, factor) : getComponentShade(rgb.b, factor)
    let brightness = (r * 299 + g * 587 + b * 114) / 1000
    // {hex: rgbToHex({r, g, b}), brightness: brightness}
    return rgbToHex({ r, g, b })
  }

  let shades
  $: shades = hexCode
    ? {
        50: getHexTintOrShade(hexCode, 0.9, true),
        100: getHexTintOrShade(hexCode, 0.8, true),
        200: getHexTintOrShade(hexCode, 0.6, true),
        300: getHexTintOrShade(hexCode, 0.4, true),
        400: getHexTintOrShade(hexCode, 0.2, true),
        500: getHexTintOrShade(hexCode, 0, true),
        600: getHexTintOrShade(hexCode, 0.9, false),
        700: getHexTintOrShade(hexCode, 0.8, false),
        800: getHexTintOrShade(hexCode, 0.6, false),
        900: getHexTintOrShade(hexCode, 0.4, false),
        950: getHexTintOrShade(hexCode, 0.2, false),
      }
    : undefined
  let on_shades
  $: on_shades = shades
    ? Object.keys(shades).reduce(function (result, key) {
        let rgb = hexToRgb(shades[key])
        let brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
        result[key] = brightness < 155 ? "#ffffff" : "#000000"
        return result
      }, {})
    : undefined

  let inputColorName: string | undefined
  let colorName: string | undefined
  $: colorName =
    inputColorName && inputColorName.trim().length > 0
      ? inputColorName.toLowerCase().replaceAll(" ", "-").replaceAll("_", "-").replaceAll(".", "")
      : undefined
  let isButtonDisabled = false
  $: isButtonDisabled =
    colorName === undefined ||
    colorName.length === 0 ||
    hexCode === undefined ||
    hexCode.length === 0

  let includeTextColor = false
  let clipboardElement: HTMLElement
  let isCopiedSuccessfully = false

  function copyCode() {
    if (!colorName) return

    let configCode = `"${colorName}": ${JSON.stringify(shades, null, 2)},`
    if (includeTextColor)
      configCode = `${configCode}\n"on-${colorName}": ${JSON.stringify(on_shades, null, 2)},`
    const copyClipboard = new CopyClipboard({
      target: clipboardElement,
      props: { value: configCode },
    })
    copyClipboard.$destroy()
    isCopiedSuccessfully = true
    setTimeout(() => (isCopiedSuccessfully = false), 2500)
  }
</script>

<div bind:this={clipboardElement} />

<main
  class="h-screen text-black flex-1 flex flex-col justify-center items-center gap-16 bg-gray-100 transition-all duration-300 ease-out animate-gradient"
  style={shades
    ? `background: linear-gradient(132deg, ${shades[300]}, ${shades[500]}, ${shades[700]}, ${shades[900]}); background-size: 400% 400%;`
    : ""}
>
  <div class="pl-5 bg-white shadow-lg rounded-lg overflow-hidden">
    <span>#</span>
    <input
      class="pl-2 pr-5 py-3 focus:outline-none"
      placeholder="HEX code"
      maxlength="6"
      bind:value={inputHexCode}
    />
  </div>
  <div
    class="h-24 flex gap-5 opacity-0 transition-all duration-300 ease-out"
    class:opacity-100={shades !== undefined}
  >
    {#if shades}
      {#each Object.entries(shades) as [weight, hex], i}
        <div
          class="w-24 h-24 shadow-lg flex justify-center items-center bg-white rounded-xl text-2xl font-bold"
          style="background: {hex}; color: {Object.entries(on_shades)[i][1]}"
        >
          {weight}
        </div>
      {/each}
    {/if}
  </div>
  {#if on_shades}
    <div>
      <label class="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" bind:checked={includeTextColor} class="sr-only peer" />
        <div
          class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"
        />
        <span class="ml-3 text-sm font-medium" style="color: {on_shades[500]}"
          >Include text color</span
        >
      </label>
    </div>
  {/if}
  <div class="flex gap-2">
    <input
      class="px-5 py-3 shadow-lg rounded-lg"
      placeholder="Color name"
      bind:value={inputColorName}
    />
    <button
      class="w-32 h-12 flex justify-center bg-gray-400 text-white py-3 rounded-lg transition-all duration-100 ease-in"
      disabled={isButtonDisabled}
      class:shadow-lg={!isButtonDisabled}
      class:bg-green-500={!isButtonDisabled}
      class:hover:bg-green-600={!isButtonDisabled}
      class:active:bg-green-700={!isButtonDisabled}
      on:click={copyCode}
    >
      {#if isCopiedSuccessfully}
        <iconify-icon class="text-2xl mx-6" icon="material-symbols:check" />
      {:else}
        Copy code
      {/if}
    </button>
  </div>
</main>
