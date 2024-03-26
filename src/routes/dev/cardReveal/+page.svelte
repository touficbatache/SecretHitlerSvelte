<script lang="ts">
  import { fade } from "svelte/transition"
  import { expoOut } from "svelte/easing"

  import Deck from "$lib/components/Deck.svelte"

  let reveal: boolean = false
</script>

<main class="flex flex-col">
  <div class="w-40 h-40 z-0">
    <Deck cards={["fascist", "liberal", "fascist"]} />
  </div>

  <button
    class="w-fit mt-40 px-10 py-5 bg-gray-200 text-neutral-600 rounded-2xl"
    on:click={() => (reveal = true)}
  >
    Reveal cards
  </button>
</main>

{#if reveal}
  <div
    class="h-full w-full absolute top-0 right-0 bottom-0 left-0 flex flex-col items-center justify-center bg-black bg-opacity-90"
    transition:fade={{ duration: 400, easing: expoOut }}
  >
    <div class="w-96 h-96">
      <Deck cards={["fascist", "liberal", "fascist"]} interactive={true} />
      <!--    debug={true}-->
    </div>
    <button
      class="mt-40 px-10 py-5 bg-[#373633] text-white rounded-2xl"
      on:click={() => (reveal = false)}
    >
      Done
    </button>
  </div>
{/if}
