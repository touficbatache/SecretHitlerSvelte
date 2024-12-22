<script lang="ts">
  export let weight:
    | "thin"
    | "extralight"
    | "light"
    | "normal"
    | "medium"
    | "semibold"
    | "bold"
    | "extrabold"
    | "black" = "normal"

  $: textStrokeWidth = getTextStrokeWidth(weight)

  $: svgStrokeWidth = getSVGStrokeWidth(weight)

  function getTextStrokeWidth(weight: string) {
    switch (weight) {
      case "thin":
        return 2.4
      case "extralight":
        return 2.5
      case "light":
        return 2.6
      case "normal":
        return 2.7
      case "medium":
        return 2.8
      case "semibold":
        return 2.9
      case "bold":
        return 3
      case "extrabold":
        return 3.1
      case "black":
        return 3.2
    }
  }

  function getSVGStrokeWidth(weight: string) {
    switch (weight) {
      case "thin":
        return 10
      case "extralight":
        return 11
      case "light":
        return 12
      case "normal":
        return 12.5
      case "medium":
        return 13.5
      case "semibold":
        return 14.5
      case "bold":
        return 14.5
      case "extrabold":
        return 15
      case "black":
        return 15
    }
  }
</script>

<div
  class="relative z-10 inline-block antialiased {$$props.class ?? ''} font-{weight}"
  style="--svg-stroke-width: {svgStrokeWidth}%;"
>
  <span
    class="elevated-text w-full flex justify-center gap-2 text-black text-nowrap absolute -z-[1] left-1/2 top-[calc(50%+0.5px)] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
    style="-webkit-text-stroke: black {textStrokeWidth}px;"
  >
    <slot />
  </span>

  <span class="flex justify-center gap-2 text-nowrap">
    <slot />
  </span>
</div>

<style lang="postcss">
  :global(.elevated-text svg) {
    @apply overflow-visible;
    stroke: black;
    stroke-width: var(--svg-stroke-width);
    stroke-linecap: round;
  }
</style>
