<!-- https://codepen.io/mrrocks/pen/ExLovj -->
<script lang="ts">
  export let color: string
</script>

<svg class="spinner" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
  <circle
    class="path"
    fill="none"
    stroke-width="6"
    stroke={color}
    stroke-linecap="round"
    cx="33"
    cy="33"
    r="30"
  />
</svg>

<style>
  .spinner {
    -webkit-animation: rotator 1.4s linear infinite;
    animation: rotator 1.4s linear infinite;
  }

  @-webkit-keyframes rotator {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(270deg);
    }
  }

  @keyframes rotator {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(270deg);
    }
  }

  .path {
    stroke-dasharray: 187;
    stroke-dashoffset: 0;
    transform-origin: center;
    -webkit-animation: dash 1.4s ease-in-out infinite;
    animation: dash 1.4s ease-in-out infinite;
  }

  @-webkit-keyframes dash {
    0% {
      stroke-dashoffset: 187;
    }
    50% {
      stroke-dashoffset: 46.75;
      transform: rotate(135deg);
    }
    100% {
      stroke-dashoffset: 187;
      transform: rotate(450deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dashoffset: 187;
    }
    50% {
      stroke-dashoffset: 46.75;
      transform: rotate(135deg);
    }
    100% {
      stroke-dashoffset: 187;
      transform: rotate(450deg);
    }
  }
</style>
