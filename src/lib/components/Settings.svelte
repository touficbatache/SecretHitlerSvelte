<script lang="ts">
  import SettingToggle from "$lib/components/SettingToggle.svelte"

  export let hideAvatars: boolean
  export let skipLongIntro: boolean
</script>

<div class="py-4 flex flex-col bg-button-500 shadow-md rounded-lg">
  <span class="w-full text-center">Settings</span>

  <div class="flex flex-col mt-4">
    <SettingToggle
      bind:checked={hideAvatars}
      icon="material-symbols:no-accounts-outline"
      title="Hide avatars in info"
    />
    <SettingToggle
      bind:checked={skipLongIntro}
      icon="material-symbols:fast-forward-outline"
      title="Skip long intro"
    />
  </div>
</div>
