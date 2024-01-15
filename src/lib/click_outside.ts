/** Dispatch event on click outside of node */
export interface ClickOutsideOptions {
  callback: (() => void) | undefined
  excluded?: HTMLElement[]
}

export const clickOutside = (node: HTMLElement, options: ClickOutsideOptions | undefined) => {
  if (options === undefined || options.callback === undefined) {
    return
  }

  const handleClick = (event: MouseEvent) => {
    if (!event?.target) return
    if (
      node &&
      !node.contains(event.target as Node) &&
      (options.excluded?.every((excludeNode) => !excludeNode.contains(event.target as Node)) ??
        true) &&
      !event.defaultPrevented
    ) {
      options.callback()
    }
  }

  document.addEventListener("click", handleClick, true)

  return {
    destroy() {
      document.removeEventListener("click", handleClick, true)
    },
  }
}
