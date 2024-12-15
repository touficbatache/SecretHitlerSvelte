<script lang="ts">
  import Icon from "@iconify/svelte"

  export let icon: string
</script>

<div class="relative z-10">
  <span class="w-full absolute -z-[1] left-1/2 top-[51%] -translate-x-1/2 -translate-y-1/2">
    <Icon
      class="{$$props.class} !overflow-visible !text-black"
      {icon}
      style="stroke: black; stroke-width: 12.5%; stroke-linecap: round;"
    />
  </span>

  <Icon class={$$props.class} {icon} />
</div>
