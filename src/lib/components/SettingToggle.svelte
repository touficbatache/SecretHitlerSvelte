<script lang="ts">
  import Icon from "@iconify/svelte"

  import ElevatedText from "$lib/components/ElevatedText.svelte"

  export let checked: boolean
  export let icon: string
  export let title: string
</script>

<label
  class="w-full px-6 py-2 inline-flex items-center gap-4 cursor-pointer hover:bg-gray-400 hover:bg-opacity-[0.08] active:bg-opacity-[0.12]"
>
  <ElevatedText class="p-1 text-2xl md:text-3xl bg-red-800 rounded-md">
    <Icon {icon} />
  </ElevatedText>

  <span class="flex-1">{title}</span>

  <div class="relative">
    <input type="checkbox" bind:checked class="sr-only peer" />
    <!--          peer-checked:bg-sh-yellow-800-->
    <div
      class="w-9 h-5 bg-sh-grey-less-dark peer-focus:outline-none rounded-md peer peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:after:opacity-100 peer-checked:after:bg-white peer-checked:after:left-0 after:content-[''] after:absolute after:-top-1 after:-left-1 after:bg-neutral-500 after:border-sh-grey-less-dark after:border after:rounded-md after:h-7 after:w-5 after:transition-all peer-checked:bg-red-800"
    />
  </div>
</label>
