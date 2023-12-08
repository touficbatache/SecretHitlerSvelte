<div {...$$restProps}>
  <div class="w-full h-full flex flex-col md:flex-row justify-between">
    <div class="flex-1 w-full h-full">
      <slot name="first" />
    </div>
    <div class="flex-1 w-full h-full">
      <slot name="second" />
    </div>
  </div>
</div>
