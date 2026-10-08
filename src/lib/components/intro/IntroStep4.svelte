<script lang="ts">
  import CountDown from "$lib/components/CountDown.svelte"

  /** When the intro ends, on the server's clock. */
  export let until: number | undefined
</script>

<CountDown
  classContainer=""
  classNumber="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl"
  {until}
/>
