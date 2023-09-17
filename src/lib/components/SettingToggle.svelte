<script lang="ts">
  export let checked: boolean
  export let icon: string
  export let title: string
</script>

<label
  class="w-full px-6 py-2 inline-flex items-center gap-4 cursor-pointer hover:bg-gray-400 hover:bg-opacity-[0.08] active:bg-opacity-[0.12]"
>
  <iconify-icon class="text-2xl p-1 bg-red-800 rounded-md" {icon} />

  <span class="flex-1">{title}</span>

  <div class="relative">
    <input type="checkbox" bind:checked class="sr-only peer" />
    <!--          peer-checked:bg-sh-yellow-800-->
    <div
      class="w-11 h-6 bg-sh-grey-less-dark peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:after:opacity-100 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:opacity-50 after:bg-white after:border-sh-grey-less-dark after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-800"
    />
  </div>
</label>
