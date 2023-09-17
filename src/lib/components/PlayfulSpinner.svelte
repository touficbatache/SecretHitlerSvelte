<script lang="ts">
  import Icon from "@iconify/svelte"

  export let color: string
</script>

<Icon
  class="text-5xl animate-[rotator_1.4s_step-end_infinite]"
  icon="fa:spinner"
  style="color: {color}; stroke: black; stroke-width: 1em; stroke-linecap: round;"
/>
