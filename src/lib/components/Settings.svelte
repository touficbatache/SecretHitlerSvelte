<script lang="ts">
  import SettingToggle from "$lib/components/SettingToggle.svelte"

  export let classes: string = ""
  export let hideAvatars: boolean
  export let skipLongIntro: boolean
</script>

<div class="w-full py-4 flex flex-col bg-neutral-800 rounded-lg {classes} frame-indented">
  <span class="w-full text-center text-lg">Settings</span>

  <div class="flex flex-col mt-4">
    <SettingToggle
      bind:checked={hideAvatars}
      icon="material-symbols:account-circle-off-rounded"
      title="Hide avatars in info"
    />
    <SettingToggle
      bind:checked={skipLongIntro}
      icon="material-symbols:fast-forward-rounded"
      title="Skip long intro"
    />
  </div>
</div>
