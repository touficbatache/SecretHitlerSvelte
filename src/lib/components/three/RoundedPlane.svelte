<script lang="ts">
  import { T } from "@threlte/core"
  import { ExtrudeGeometry, Shape, ShapeGeometry } from "three"
  import { useTexture } from "@threlte/extras"

  export let color: string = "white"
  export let width = 3.5
  export let height = 4.9
  export let radius = 0.5
  export let depth = 0.1

  let x = 1
  let y = 1

  const createGeometry = (width: number, height: number, radius: number): ExtrudeGeometry => {
    let shape = new Shape()
    shape.moveTo(x, y + radius)
    shape.lineTo(x, y + height - radius)
    shape.quadraticCurveTo(x, y + height, x + radius, y + height)
    shape.lineTo(x + width - radius, y + height)
    shape.quadraticCurveTo(x + width, y + height, x + width, y + height - radius)
    shape.lineTo(x + width, y + radius)
    shape.quadraticCurveTo(x + width, y, x + width - radius, y)
    shape.lineTo(x + radius, y)
    shape.quadraticCurveTo(x, y, x, y + radius)

    const geometry = new ExtrudeGeometry(shape, {
      depth: depth,
      bevelEnabled: false,
      bevelSegments: 2,
      steps: 2,
      bevelSize: 1,
      bevelThickness: 1,
    })
    geometry.center()
    return geometry
  }

  $: geometry = createGeometry(width, height, radius)
</script>

<T.Mesh {...$$restProps}>
  <T is={geometry} />
  {#await useTexture("/policy_liberal.png") then texture}
    <T.MeshStandardMaterial map={texture} />
  {/await}
  <!--{#each ["/policy_liberal.png", "#fff", "#fff", "#fff", "#fff", "/policy_backcover.png"] as material}-->
  <!--  {#if material.startsWith("/")}-->
  <!--    {#await useTexture(material) then texture}-->
  <!--      <T.MeshStandardMaterial-->
  <!--        map={texture}-->
  <!--        attach={(parent, self) => {-->
  <!--          if (Array.isArray(parent.material)) parent.material = [...parent.material, self]-->
  <!--          else parent.material = [self]-->
  <!--        }}-->
  <!--      />-->
  <!--    {/await}-->
  <!--  {:else}-->
  <!--    <T.MeshStandardMaterial-->
  <!--      color={material}-->
  <!--      attach={(parent, self) => {-->
  <!--        if (Array.isArray(parent.material)) parent.material = [...parent.material, self]-->
  <!--        else parent.material = [self]-->
  <!--      }}-->
  <!--    />-->
  <!--  {/if}-->
  <!--{/each}-->
</T.Mesh>
