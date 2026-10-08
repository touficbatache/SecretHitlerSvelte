import type { Action } from "svelte/action"

/** Dispatch event on click outside of node */
export interface ClickOutsideOptions {
  callback: (() => void) | undefined
  excluded?: HTMLElement[]
}

export const clickOutside: Action<HTMLElement, ClickOutsideOptions | undefined> = (
  node: HTMLElement,
  options: ClickOutsideOptions | undefined,
) => {
  if (options === undefined || options.callback === undefined) {
    return
  }
  const callback: () => void = options.callback

  const handleClick: (event: MouseEvent) => void = (event) => {
    if (!event?.target) return
    if (
      node &&
      !node.contains(event.target as Node) &&
      (options.excluded?.every((excludeNode) => !excludeNode.contains(event.target as Node)) ??
        true) &&
      !event.defaultPrevented
    ) {
      callback()
    }
  }

  document.addEventListener("click", handleClick, true)

  return {
    destroy() {
      document.removeEventListener("click", handleClick, true)
    },
  }
}
