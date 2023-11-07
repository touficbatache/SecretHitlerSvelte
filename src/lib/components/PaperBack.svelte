<script lang="ts">
  export let classes = ""
  export let contentClasses = ""
  export let backgroundColor = "#ffffff"
</script>

<div
  class="relative {classes}"
  style="
  --background-color: {backgroundColor};
  clip-path: polygon(
      0.25rem 0px,
      calc(100% - 0.25rem) 0px,
      100% 0.25rem,
      100% calc(100% - 0.25rem),
      calc(100% - 0.25rem) 100%,
      0.25rem 100%,
      0px calc(100% - 0.25rem),
      0px 0.25rem
    );"
>
  <div
    class="pointer-events-none absolute inset-0 paperback-background bg-center bg-cover after:absolute after:inset-0 after:bg-paperback after:bg-center after:bg-cover after:mix-blend-multiply"
  >
    <!--    <div-->
    <!--      class="absolute inset-0"-->
    <!--      style="background: linear-gradient(rgba(255, 255, 255, 0.2) 4px, rgba(0, 0, 0, 0.05) 4px, transparent calc(100% - 4px), rgba(0, 0, 0, 0.2) 4px), linear-gradient(90deg, rgba(0, 0, 0, 0.1) 4px, transparent 4px, transparent calc(100% - 4px), rgba(0, 0, 0, 0.1) 4px)"-->
    <!--    />-->

    <!--    <div class="absolute inset-x-0 top-0 h-1 bg-white bg-opacity-20" />-->
    <!--    <div-->
    <!--      class="absolute inset-x-0 top-1 bottom-1 bg-gradient-to-b from-black to-30% to-transparent opacity-5"-->
    <!--    />-->
    <!--    <div class="absolute inset-x-0 bottom-0 h-1 bg-black bg-opacity-20" />-->
    <!--    <div class="absolute left-0 inset-y-0 w-1 bg-black bg-opacity-10" />-->
    <!--    <div class="absolute right-0 inset-y-0 w-1 bg-black bg-opacity-10" />-->
  </div>
  <div class="relative {contentClasses}">
    <slot />
  </div>
</div>

<style lang="postcss">
  .paperback-background {
    background: linear-gradient(
        rgba(255, 255, 255, 0.2) 4px,
        rgba(0, 0, 0, 0.05) 4px,
        transparent calc(100% - 4px),
        rgba(0, 0, 0, 0.2) 4px
      ),
      linear-gradient(
        90deg,
        rgba(0, 0, 0, 0.1) 4px,
        transparent 4px,
        transparent calc(100% - 4px),
        rgba(0, 0, 0, 0.1) 4px
      ),
      var(--background-color);
  }
</style>
