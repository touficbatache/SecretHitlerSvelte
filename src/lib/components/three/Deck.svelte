<script lang="ts">
  import { T } from "@threlte/core"
  import { useTexture } from "@threlte/extras"
  import { DEG2RAD } from "three/src/math/MathUtils.js"

  import RoundedPlaneGeometry from "$lib/components/three/RoundedPlaneGeometry.svelte"

  export let policies: string[] = []
  export let type: "draw" | "discard" | undefined = undefined

  function getPolicyFaceMaterial(policy: string, index: number) {
    if (index === 0) {
      return policy === "liberal"
        ? "/policy_liberal.png"
        : policy === "fascist"
        ? "/policy_fascist.png"
        : "/policy_backcover.png"
    }
    if (index === 1) {
      return "/policy_backcover.png"
    }
    return "/policy_side.png"
  }
</script>

{#if type !== undefined}
  {@const cardMaterial = type === "draw" ? "/pile_draw.png" : "/pile_discard.png"}
  <T.Mesh position.y={-0.25} castShadow receiveShadow>
    <RoundedPlaneGeometry args={[4.48, 6.4, 0.05]} />
    {#each [cardMaterial, cardMaterial, "#fff"] as material, i}
      {#if material.startsWith("/")}
        {#await useTexture(material) then texture}
          <T.MeshStandardMaterial
            map={texture}
            attach={(parent, self) => {
              if (!Array.isArray(parent.material)) {
                parent.material = []
              }
              parent.material.splice(i, 0, self)
            }}
          />
        {/await}
      {:else}
        <T.MeshStandardMaterial
          color={material}
          attach={(parent, self) => {
            if (!Array.isArray(parent.material)) {
              parent.material = []
            }
            parent.material.splice(i, 0, self)
          }}
        />
      {/if}
    {/each}
  </T.Mesh>
{/if}
<T.Group position.z={0.125}>
  {#each policies as policy, i}
    <T.Mesh position.z={0.2 * i} rotation.y={DEG2RAD * 180} castShadow>
      <RoundedPlaneGeometry args={[3.5, 4.9, 0.2]} />
      {#each Array(3) as _, index}
        {@const material = getPolicyFaceMaterial(policy, index)}
        {#if material.startsWith("/")}
          {#await useTexture(material) then texture}
            <T.MeshStandardMaterial
              map={texture}
              attach={(parent, self) => {
                if (!Array.isArray(parent.material)) {
                  parent.material = []
                }
                parent.material.splice(index, 0, self)
              }}
            />
          {/await}
        {:else}
          <T.MeshStandardMaterial
            color={material}
            attach={(parent, self) => {
              if (!Array.isArray(parent.material)) {
                parent.material = []
              }
              parent.material.splice(index, 0, self)
            }}
          />
        {/if}
      {/each}
    </T.Mesh>
  {/each}
</T.Group>
