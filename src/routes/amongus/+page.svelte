<script lang="ts">
  import { onMount } from "svelte"
  import { sineOut } from "svelte/easing"
  import { tweened } from "svelte/motion"

  let offsetX = 0
  let offsetY = 0

  let playerOffsetX = 0
  let playerOffsetY = 0

  const playerOffset = tweened(
    { x: 0, y: 0 },
    {
      duration: 500,
      easing: sineOut,
    },
  )

  const cameraOffset = tweened(
    { x: 0, y: 0 },
    {
      duration: 500,
      easing: sineOut,
    },
  )

  let direction = ""

  let isFacingLeft = false
  let isWalking = false

  const step = 30

  let abortController = new AbortController()

  let timerMs = 0.01
  let timerOffset = 0.7
  let cameraTimer
  function cameraLeft() {
    if (cameraTimer !== undefined) return
    cameraTimer = setInterval(() => {
      offsetX += timerOffset
    }, timerMs)
  }
  function cameraRight() {
    if (cameraTimer !== undefined) return
    cameraTimer = setInterval(() => {
      offsetX -= timerOffset
    }, timerMs)
  }
  function cameraUp() {
    if (cameraTimer !== undefined) return
    cameraTimer = setInterval(() => {
      offsetY += timerOffset
    }, timerMs)
  }
  function cameraDown() {
    if (cameraTimer !== undefined) return
    cameraTimer = setInterval(() => {
      offsetY -= timerOffset
    }, timerMs)
  }

  onMount(() => {
    abortController.abort()
    abortController = new AbortController()

    document.addEventListener(
      "keydown",
      function (event) {
        if (event.code === "ArrowLeft") {
          // offsetX += step
          playerOffsetX = -step
          direction = "left"
          isFacingLeft = true
          cameraLeft()
        } else if (event.code === "ArrowRight") {
          // offsetX -= step
          playerOffsetX = step
          direction = "right"
          isFacingLeft = false
          cameraRight()
        } else if (event.code === "ArrowUp") {
          // offsetY += step
          direction = "up"
          playerOffsetY = -step
          cameraUp()
        } else if (event.code === "ArrowDown") {
          // offsetY -= step
          direction = "down"
          playerOffsetY = step
          cameraDown()
        }

        if (
          event.code === "ArrowLeft" ||
          event.code === "ArrowRight" ||
          event.code === "ArrowUp" ||
          event.code === "ArrowDown"
        ) {
          // offset.set({ x: offsetX, y: offsetY })
          playerOffset.set({ x: playerOffsetX, y: playerOffsetY })
          isWalking = true
        }
      },
      { signal: abortController.signal },
    )

    document.addEventListener(
      "keyup",
      () => {
        clearInterval(cameraTimer)
        cameraTimer = undefined

        if (direction === "left") {
          cameraOffset.set({ x: $cameraOffset.x + Math.abs($playerOffset.x), y: $cameraOffset.y })
        } else if (direction === "right") {
          cameraOffset.set({ x: $cameraOffset.x - Math.abs($playerOffset.x), y: $cameraOffset.y })
        } else if (direction === "up") {
          cameraOffset.set({ x: $cameraOffset.x, y: $cameraOffset.y + Math.abs($playerOffset.y) })
        } else if (direction === "down") {
          cameraOffset.set({ x: $cameraOffset.x, y: $cameraOffset.y - Math.abs($playerOffset.y) })
        }

        isWalking = false
        playerOffsetX = 0
        playerOffsetY = 0
        playerOffset.set({ x: playerOffsetX, y: playerOffsetY })
      },
      { signal: abortController.signal },
    )
  })

  // $: console.log(
  //   "pofx",
  //   $playerOffset.x,
  //   "ofx",
  //   offsetX,
  //   "cofx",
  //   $cameraOffset.x,
  //   "ofx + cofx",
  //   offsetX + $cameraOffset.x,
  //   "cofy",
  //   $cameraOffset.y,
  //   "ofy + cofy",
  //   offsetY + $cameraOffset.y,
  // )
</script>

<!--  style:background-position="4511px 3851px"-->
<!--background-position: 56.7% 18%;-->
<!--+ (!isWalking ? $playerOffset.x : $playerOffset.x)-->
<!--+ (!isWalking ? $playerOffset.y : $playerOffset.y)-->

<!--style="background-size: 450%; background-position: calc(58% + {offsetX +-->
<!--(direction === 'right' ? step * -1 : step) +-->
<!--$playerOffset.x}px) calc(25% + {offsetY}px);"-->
<div
  class="absolute w-screen h-screen bg-[url(/amongus/map.png)]"
  style="background-size: 450%; background-position: calc(58% + {offsetX +
    $cameraOffset.x}px) calc(25% + {offsetY + $cameraOffset.y}px);"
>
  <!--  <div class="absolute left-1/2 inset-y-0 w-1 bg-black"></div>-->
  <!--    <div class="absolute top-1/2 inset-x-0 h-1 bg-black"></div>-->
  <div
    class="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
    class:scale-x-[-1]={isFacingLeft}
    style:margin-left={$playerOffset.x + "px"}
    style:margin-top={$playerOffset.y + "px"}
  >
    <div
      class="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 scale-[.11] bg-contain bg-[url(/amongus/standing.png)] aspect-[784/1023]"
      class:hidden={isWalking}
      style="width: 784px; height: 1023px;"
    />

    <div
      class="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 bg-walking aspect-[784/1023]"
      class:hidden={!isWalking}
      style="width: 86px; height: 112px; background-size: 500%;"
    />
  </div>
</div>

<style lang="postcss">
  .bg-walking {
    @apply bg-[url(/amongus/walking.png)];
    animation: anim-ss-x steps(5) 120ms infinite, anim-ss-y steps(6) 720ms infinite;
  }

  @keyframes anim-ss-x {
    0% {
      background-position-x: 0px;
    }
    100% {
      /*background-position-x: -3920px;*/
      /*86*5*/
      background-position-x: -430px;
    }
  }
  @keyframes anim-ss-y {
    0% {
      background-position-y: 0px;
    }
    100% {
      /*background-position-y: -6138px;*/
      /*112*6*/
      background-position-y: -672px;
    }
  }
</style>
