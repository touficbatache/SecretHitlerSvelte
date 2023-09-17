<script lang="ts">
  export let cards: string[]
  export let debug = false
  export let interactive = false

  // Helper function to check if the touch position is inside an element
  function isInsideElement(touchX, touchY, element) {
    const rect = element.getBoundingClientRect()
    return touchX >= rect.left && touchX <= rect.right && touchY >= rect.top && touchY <= rect.bottom
  }

  let deckEl = undefined
  let isContainerExpanded = false
  let revealedElementIndex = undefined

  function onContainerTouchStartEnd(event) {
    if (!interactive) return

    if (event.type === "touchstart" || event.type === "mouseenter") {
      isContainerExpanded = true
    } else if (event.type === "touchend" || event.type === "mouseleave") {
      isContainerExpanded = false
    }
    revealedElementIndex = null
  }

  function onContainerTouchMove(event) {
    if (!interactive) return

    // Check if the touch is inside any of the child elements
    deckEl?.querySelectorAll(":scope>*").forEach((el, index) => {
      if (
        revealedElementIndex !== index &&
        isInsideElement(
          event.type.includes("touch") ? event.touches[0].clientX : event.clientX,
          event.type.includes("touch") ? event.touches[0].clientY : event.clientY,
          el,
        )
      ) {
        revealedElementIndex = index
      }
    })
  }
</script>

{#if cards}
  <ol
    class="deck"
    bind:this={deckEl}
    on:touchstart={onContainerTouchStartEnd}
    on:mouseenter={onContainerTouchStartEnd}
    on:touchmove={onContainerTouchMove}
    on:mousemove={onContainerTouchMove}
    on:touchend={onContainerTouchStartEnd}
    on:mouseleave={onContainerTouchStartEnd}
    class:expanded={isContainerExpanded}
    class:debug={debug}
  >
    {#each cards as card, index}
      <li
        class="hitbox"
        class:reveal={isContainerExpanded && revealedElementIndex === index} style:z-index={cards.length - index}
        class:debug={debug}
      >
        <div class="card flipped {card}" style:z-index={cards.length - index}>
          <!--          style:transform={index === 1 ? "rotateX(0deg) rotateY(309deg) rotateZ(110deg) translate(-25px, 50px)" : ""}-->
          <div class="depth"></div>
        </div>
      </li>
    {/each}
  </ol>
{/if}

<style>
    .deck {
        @apply w-full h-full flex flex-col justify-end items-center touch-none;
    }

    .deck.debug {
        @apply bg-red-400 bg-opacity-50 border border-black;
    }

    .deck * {
        @apply select-none;
    }

    .deck > * {
        @apply transition-all duration-500 w-[80%] h-[30%] shrink-0;
    }

    .deck > .debug {
        @apply bg-blue-400 bg-opacity-30 border border-black;
    }

    .hitbox {
        perspective: 10000;
        -webkit-perspective: 10000; /* This fixes a pass-through bug on iPhone Safari */
    }

    .deck .card {
        position: relative;
        top: -50%;
        margin: 0 auto;
        width: 50%;
        aspect-ratio: 5/7;
        border-radius: 6.5%;
        /*border-radius: 12px;*/
        color: #fff;
        transform-style: preserve-3d;
        transform: rotateX(45deg) rotateY(15deg) rotate(-45deg);
        /* transform: rotateX(45deg) rotateY(195deg) rotate(45deg); */
        transition: all 0.4s ease;
        pointer-events: none;
        box-shadow: -1.5px 1.5px 0px 0.5px #ececec, -3px 3.3px 0px 0.4px #9E9E9E, -5.5px 6px 0px -0.5px #ececec, -9px 9px 20px 0px rgba(143, 143, 143, 0.5);

        /*box-shadow: -1.5px 1.5px 0px 0.5px #ececec, -3px 3.3px 0px 0.4px #9E9E9E, -5px 5px 0px 0.5px #ececec, -9px 9px 20px 0px rgba(143, 143, 143, 0.5);*/

        /*box-shadow: -1.5px 1.5px 0px 0.5px #ececec, -3px 3px 0px 0.75px #9E9E9E, -5px 5px 0px 0.5px #ececec, -9px 9px 20px 0px rgba(143, 143, 143, 0.5);*/

        /*box-shadow: -1.5px 1.5px 0px 0.5px #ececec, -3.3px 3.3px 0px 0.75px #9E9E9E, -4.5px 4.5px 0px 0.75px #ececec, -9px 9px 20px 0px rgba(143, 143, 143, 0.5);*/

        /*box-shadow: -1.5px 1.5px 0px 0.5px #ececec, -3.3px 3.3px 0px 0.75px #9E9E9E, -5px 5px 0px 0.75px #ececec, -9px 9px 20px 0px rgba(143, 143, 143, 0.5);*/

        /*box-shadow: -1.5px 1.5px 0px 0.5px #ececec, -3px 3px 0px 1px #9E9E9E, -5px 5px 0px 0.5px #ececec, -9px 9px 20px 0px rgba(143, 143, 143, 0.5);*/

        /*box-shadow: -1.5px 1px 0px 1px #ececec, -3px 3px 0px 1px #9E9E9E, -5px 4.5px 0px 1px #ececec, -9px 9px 20px 0px rgba(143, 143, 143, 0.5);*/

        /* box-shadow: -1.5px 1px 0px 1px #ececec, -3px 3px 0px 1px #9E9E9E, -5px 4.5px 0px 1px #ececec, -20px 20px 60px rgba(143, 143, 143, 0.5); */

        /* box-shadow: -20px 20px 60px rgba(143, 143, 143, 0.5), -2px 3px 0px 2px #9E9E9E; */
    }

    /*.deck .card::before,*/
    .deck .card > .depth {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 6.5%;
        /*border-radius: 12px;*/
        transform: rotateY(180deg);
        transform-origin: 50% 0 -0.5px;
        background-image: url(/policy_backcover.png);
        background-size: cover;
    }

    .deck .card.flipped {
        /* transform: rotateX(45deg) rotateY(195deg) rotate(45deg); */
        /* transform: rotateX(150deg) rotateY(-137deg) rotate(111deg); */
        transform: rotateX(45deg) rotateY(-165deg) rotate(45deg);
        box-shadow: 1.5px 1.5px 0px 0.5px #ececec, 3px 3.3px 0px 0.4px #9E9E9E, 5.5px 6px 0px -0.5px #ececec, 9px 9px 20px 0px rgba(143, 143, 143, 0.5);
    }

    .deck > *:not(:first-child) {
        margin-top: calc(-28.7%);
        /*margin-top: calc(-30% + 5px);*/
    }

    .deck.expanded > *:not(:first-child) {
        margin-top: 0;
    }

    .deck .card.fascist {
        @apply bg-[url(policy_fascist.png)] bg-cover;
    }

    .deck .card.liberal {
        @apply bg-[url(policy_liberal.png)] bg-cover;
    }

    .deck .reveal .card {
        transform: rotateX(30deg) rotateY(15deg) rotate(-30deg) translate(-10%, 20%);
        /*transform: rotateX(30deg) rotateY(15deg) rotate(-30deg) translate(-25px, 50px);*/
        /*box-shadow: -1.5px 1.5px 0px 0.5px #ececec, -3px 3.3px 0px 0.4px #9E9E9E, -5px 5px 0px 0.5px #ececec, -9px 9px 20px 0px rgba(143, 143, 143, 0.5);*/
    }

    .deck .reveal .card.fascist {
        box-shadow: -1.5px 1.5px 0px 0.5px #ececec, -3px 3.3px 0px 0.4px #9E9E9E, -5.5px 6px 0px -0.5px #ececec, -9px 9px 20px 0px rgba(214, 13, 0, 0.3);
    }

    .deck .reveal .card.liberal {
        box-shadow: -1.5px 1.5px 0px 0.5px #ececec, -3px 3.3px 0px 0.4px #9E9E9E, -5.5px 6px 0px -0.5px #ececec, -9px 9px 20px 0px rgba(0, 145, 179, 0.3);
    }

    /*.tariffCards > div:hover .card:after,*/
    /*.deck > .reveal .card:after {*/
    /*    transform: translateX(100%);*/
    /*    transition: all 1.2s ease-in-out;*/
    /*}*/

    /* shine */
    /* .deck:after {
        position: absolute;
        bottom: -27px;
        left: 5%;
        content: '';
        width: 65%;
        height: 10px;
        border-radius: 100%;
        background-image: radial-gradient(rgba(34, 50, 84, 0.04), rgba(34, 50, 84, 0));
    } */

    /* shine */
    /* .deck .card:after {
        content: '';
        position: absolute;
        top: -70px;
        left: 0;
        width: 200%;
        height: 200%;
        background-image: linear-gradient(60deg, rgba(255, 255, 255, 0) 20%, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0) 80%);
        transform: translateX(-100%);
    } */

    /* .deck .card:after {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        width: 200%;
        height: 50%;
        background: red;
    }

    .deck .card::after {
        transform: rotateX(-30deg) rotateY(-35deg) rotateZ(27.55deg);
    }

    .deck .card.flipped::after {
        transform: rotateX(45deg) rotateY(-45deg) rotateZ(-17.5deg);
    } */
</style>