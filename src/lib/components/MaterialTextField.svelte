<script lang="ts">
  import { v4 as uuidV4 } from "uuid"

  let uuid = uuidV4()

  let labelWidth
</script>

<div class="h-14 inline-flex relative">
  <input
    id="mtf-{uuid}"
    placeholder=" "
    class="peer w-full flex pt-3 px-4 pb-3.5 bg-transparent text-white text-opacity-80 outline-none"
  />
  <div
    class="flex absolute inset-0 pointer-events-none peer-focus:active peer-placeholder-shown:inactive"
  >
    <div class="w-3 rounded-l border border-white border-opacity-40 border-r-0 left" />
    <div
      class="border border-white border-opacity-40 border-x-0 notch notch-cut"
      style="width: {labelWidth * 0.75 + 8}px"
    />
    <div class="flex-grow rounded-r border border-white border-opacity-40 border-l-0 right" />
  </div>
  <label
    for="mtf-{uuid}"
    class="inline-block absolute pointer-events-none left-4 top-1/2 label-floating text-white text-opacity-60 origin-top-left transform duration-150 ease-material-standard peer-placeholder-shown:label-resting peer-focus:label-floating"
    bind:clientWidth={labelWidth}>Phone number</label
  >
</div>

<style lang="postcss">
  .label-floating {
    @apply -translate-y-9 scale-75;
  }

  .label-resting {
    @apply -translate-y-1/2 scale-100;
  }

  .notch-cut {
    @apply border-t-0 border-x-0 pr-2;
  }

  .peer:placeholder-shown ~ .peer-placeholder-shown\:inactive {
    & > .left {
      @apply border-r-0;
    }

    & > .notch {
      @apply border-y border-x-0 px-0;
    }

    & > .right {
      @apply border-l-0;
    }
  }

  .peer:placeholder-shown ~ .peer-placeholder-shown\:label-resting {
    @apply label-resting;
  }

  .peer:focus ~ .peer-focus\:active {
    & > .left {
      @apply border-2 border-r-0 border-blue-500;
    }

    & > .notch {
      @apply border-2 notch-cut border-blue-500;
    }

    & > .right {
      @apply border-2 border-l-0 border-blue-500;
    }
  }

  .peer:focus ~ .peer-focus\:label-floating {
    @apply label-floating;
  }
</style>
