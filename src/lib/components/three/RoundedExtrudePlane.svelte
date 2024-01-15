<script lang="ts">
  import { T } from "@threlte/core"
  import { ExtrudeGeometry, Shape, ShapeGeometry } from "three"
  import { useTexture } from "@threlte/extras"

  export let color = "white"
  export let width = 3.5
  export let height = 4.9
  export let radius = 0.5
  export let depth = 0.1

  let x = 1
  let y = 1

  const createGeometry = (height: number, width: number, radius: number): ExtrudeGeometry => {
    const shape: Shape = new Shape()
    shape.moveTo(0, width - radius)

    shape.lineTo(0, width - radius)
    shape.absarc(radius, width - radius, radius, 0, Math.PI / 2, true)

    shape.lineTo(height - radius, width)
    shape.absarc(height - radius, width - radius, radius, (3 * Math.PI) / 2, 2 * Math.PI, true)

    shape.lineTo(height, radius)
    shape.absarc(height - radius, radius, radius, Math.PI / 2, (3 * Math.PI) / 2, true)

    shape.lineTo(radius, 0)
    shape.absarc(radius, radius, radius, 0, Math.PI, true)
    let card_shape = new ExtrudeGeometry(shape, {
      steps: 16,
      depth: depth,
      bevelEnabled: false,
    })
    card_shape.center()
    return card_shape
  }

  $: geometry = createGeometry(width, height, radius)
</script>

<T.Mesh {...$$restProps} position.z={5}>
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
