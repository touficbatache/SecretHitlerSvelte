<script lang="ts">
  import { T, useThrelte } from "@threlte/core"
  import {
    Align,
    interactivity,
    OrbitControls,
    Portal,
    RoundedBoxGeometry,
    TransformControls,
    useTexture,
  } from "@threlte/extras"
  import { spring } from "svelte/motion"
  import type { CameraHelper, DirectionalLightHelper, TextureLoader } from "three"
  import { DEG2RAD } from "three/src/math/MathUtils"
  import RoundedPlane from "$lib/components/three/RoundedPlane.svelte"
  import { SheetObject } from "@threlte/theatre"
  import { Vector3 } from "three/src/math/Vector3"
  import RoundedExtrudePlane from "$lib/components/three/RoundedExtrudePlane.svelte"
  import RoundedBox from "$lib/components/three/RoundedBox.svelte"
  import RoundedPlaneGeometry from "$lib/components/three/RoundedPlaneGeometry.svelte"
  import Deck from "$lib/components/three/Deck.svelte"

  interactivity()

  const scale = spring(1)
  const elevationL = spring(0.15)
  const elevationF = spring(0.15)

  // let rotation = 0
  // useTask((delta) => {
  //   rotation += delta
  // })

  const { size, scene } = useThrelte()
  const D = 10
  $: aspectRatio = $size.width / $size.height

  let helperA: DirectionalLightHelper

  let helperB: DirectionalLightHelper

  let perspectiveCameraHelper: CameraHelper
  let orthographicCameraHelper: CameraHelper

  const electionTracker0: Vector3 = [-4.09, -3.4, 0.4]
  const electionTracker1: Vector3 = [-1.475, -3.4, 0.4] // x diff = 2.615
  const electionTracker2: Vector3 = [1.14, -3.4, 0.4] // x diff = 2.615
  const electionTracker3: Vector3 = [3.755, -3.4, 0.4] // x diff = 2.615
</script>

<!--<T.PerspectiveCamera-->
<!--  let:ref-->
<!--  position={[-5, 10, 5]}-->
<!--  on:create={({ ref }) => {-->
<!--    ref.lookAt(0, 0, 0)-->
<!--  }}-->
<!--&gt;-->
<!--  <OrbitControls />-->
<!--  <TransformControls-->
<!--    object={ref}-->
<!--    on:objectChange={() => {-->
<!--      if (!perspectiveCameraHelper) return-->
<!--      perspectiveCameraHelper.update()-->
<!--      //console.log(perspectiveCameraHelper.camera.position)-->
<!--    }}-->
<!--  />-->
<!--  <Portal object={scene}>-->
<!--    <T.CameraHelper-->
<!--      bind:ref={perspectiveCameraHelper}-->
<!--      args={[ref]}-->
<!--    />-->
<!--  </Portal>-->
<!--</T.PerspectiveCamera>-->

<T.OrthographicCamera
  makeDefault
  let:ref
  args={[-D * aspectRatio, D * aspectRatio, D, -D, -10, 100]}
  position={[-5, 10, 5]}
  on:create={({ ref }) => {
    ref.lookAt(0, 0, 0)
  }}
  zoom={20}
>
  <OrbitControls />
  <!--    <TransformControls-->
  <!--      object={ref}-->
  <!--      on:objectChange={() => {-->
  <!--        if (!orthographicCameraHelper) return-->
  <!--        orthographicCameraHelper.update()-->
  <!--        //console.log(orthographicCameraHelper.camera.position)-->
  <!--      }}-->
  <!--    />-->
  <!--    <Portal object={scene}>-->
  <!--      <T.CameraHelper-->
  <!--        bind:ref={orthographicCameraHelper}-->
  <!--        args={[ref]}-->
  <!--      />-->
  <!--    </Portal>-->
</T.OrthographicCamera>

<T.AmbientLight color="white" intensity={1} />

<T.DirectionalLight let:ref color="white" intensity={2} position={[3, 5, 3.5]} castShadow>
  <!--  <TransformControls-->
  <!--    object={ref}-->
  <!--    on:objectChange={() => {-->
  <!--      if (!helperA) return-->
  <!--      helperA.update()-->
  <!--      console.log(helperA.light.position)-->
  <!--    }}-->
  <!--  />-->
  <!--  <Portal object={scene}>-->
  <!--    <T.DirectionalLightHelper-->
  <!--      args={[ref]}-->
  <!--      bind:ref={helperA}-->
  <!--    />-->
  <!--  </Portal>-->
</T.DirectionalLight>

<!--<T.DirectionalLight let:ref color="white" intensity={2} position={[0, 2, 3]} castShadow>-->
<!--  <TransformControls-->
<!--    object={ref}-->
<!--    on:objectChange={() => {-->
<!--      if (!helperA) return-->
<!--      helperA.update()-->
<!--      console.log(helperA.light.position)-->
<!--    }}-->
<!--  />-->
<!--  <Portal object={scene}>-->
<!--    <T.DirectionalLightHelper-->
<!--      args={[ref]}-->
<!--      bind:ref={helperA}-->
<!--    />-->
<!--  </Portal>-->
<!--</T.DirectionalLight>-->

<!--<T.DirectionalLight let:ref color="white" intensity={2} position={[3, 2, 0]} castShadow>-->
<!--  <TransformControls-->
<!--    object={ref}-->
<!--    on:objectChange={() => {-->
<!--      if (!helperB) return-->
<!--      helperB.update()-->
<!--      console.log(helperB.light.position)-->
<!--    }}-->
<!--  />-->
<!--  <Portal object={scene}>-->
<!--    <T.DirectionalLightHelper-->
<!--      args={[ref]}-->
<!--      bind:ref={helperB}-->
<!--    />-->
<!--  </Portal>-->
<!--</T.DirectionalLight>-->

<Align rotation.x={DEG2RAD * -90}>
  <T.Group position.z={0.15}>
    <T.Mesh
      position.z={$elevationL}
      scale={$scale}
      on:pointerenter={() => {
        //scale.set(1.5)
        //elevationL.set(1)
      }}
      on:pointerleave={() => {
        //scale.set(1)
        //elevationL.set(0.15)
      }}
      castShadow
      receiveShadow
    >
      <T.BoxGeometry args={[28, 10, 0.3]} />
      {#each ["#363835", "#363835", "#363835", "#363835", "/board_liberal.png", "/board_liberal_back.png"] as material, i}
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

    <!--    <SheetObject key="Box" let:Transform let:Sync>-->
    <!--      <Transform>-->
    <T.Mesh position={electionTracker0} rotation.x={DEG2RAD * 90} castShadow>
      <T.CylinderGeometry args={[0.5, 0.5, 0.2, 50]} />
      <T.MeshStandardMaterial color="#223a7d" />
    </T.Mesh>
    <!--      </Transform>-->
    <!--    </SheetObject>-->

    {#each [-7.7, -3.85, 0, 3.85, 7.7] as positionX}
      <T.Mesh position.x={positionX} position.z={0.4} castShadow>
        <RoundedPlaneGeometry args={[3.5, 4.9, 0.2]} />
        {#each ["/policy_liberal.png", "/policy_backcover.png", "/policy_side.png"] as material, i}
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
    {/each}

    <!--    <T.Mesh position.z={0.4} castShadow>-->
    <!--      <T.BoxGeometry args={[5, 7, 0.1]} />-->
    <!--      {#each ["#fff", "#fff", "#fff", "#fff", "/policy_liberal.png", "/policy_backcover.png"] as material}-->
    <!--        {#if material.startsWith("/")}-->
    <!--          {#await useTexture(material) then texture}-->
    <!--            <T.MeshStandardMaterial-->
    <!--              map={texture}-->
    <!--              attach={(parent, self) => {-->
    <!--                if (Array.isArray(parent.material)) parent.material = [...parent.material, self]-->
    <!--                else parent.material = [self]-->
    <!--              }}-->
    <!--            />-->
    <!--          {/await}-->
    <!--        {:else}-->
    <!--          <T.MeshStandardMaterial-->
    <!--            color={material}-->
    <!--            attach={(parent, self) => {-->
    <!--              if (Array.isArray(parent.material)) parent.material = [...parent.material, self]-->
    <!--              else parent.material = [self]-->
    <!--            }}-->
    <!--          />-->
    <!--        {/if}-->
    <!--      {/each}-->
    <!--    </T.Mesh>-->
  </T.Group>

  <!--  <SheetObject-->
  <!--    key="Box"-->
  <!--    let:Transform-->
  <!--    let:Sync-->
  <!--  >-->
  <!--    <Transform>-->
  <T.Group position.y={-12} position.z={0.15}>
    <T.Mesh
      position.z={$elevationF}
      scale={$scale}
      on:pointerenter={() => {
        //scale.set(1.5)
        //elevationF.set(1)
      }}
      on:pointerleave={() => {
        scale.set(1)
        //elevationF.set(0.15)
      }}
      castShadow
      receiveShadow
    >
      <T.BoxGeometry args={[28, 10, 0.3]} />
      {#each ["#363835", "#363835", "#363835", "#363835", "/highcontrast_board_fascist_5_6.png", "/board_fascist_back.png"] as material, i}
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

    <!--    <SheetObject key="Box" let:Transform let:Sync>-->
    <!--      <Transform>-->
    <!--        <T.Mesh position.x={-9.63} position.z={0.4} castShadow>-->
    <!--          <RoundedPlaneGeometry-->
    <!--            args={[3.5, 4.9, 0.2]}-->
    <!--          />-->
    <!--          {#each ["/policy_backcover.png", "/policy_fascist.png", "/policy_side.png"] as material, i}-->
    <!--            {#if material.startsWith("/")}-->
    <!--              {#await useTexture(material) then texture}-->
    <!--                <T.MeshStandardMaterial-->
    <!--                  map={texture}-->
    <!--                  attach={(parent, self) => {-->
    <!--                    if (!Array.isArray(parent.material)) {-->
    <!--                      parent.material = []-->
    <!--                    }-->
    <!--                    parent.material.splice(i, 0, self)-->
    <!--                  }}-->
    <!--                />-->
    <!--              {/await}-->
    <!--            {:else}-->
    <!--              <T.MeshStandardMaterial-->
    <!--                color={material}-->
    <!--                attach={(parent, self) => {-->
    <!--                  if (!Array.isArray(parent.material)) {-->
    <!--                    parent.material = []-->
    <!--                  }-->
    <!--                  parent.material.splice(i, 0, self)-->
    <!--                }}-->
    <!--              />-->
    <!--            {/if}-->
    <!--          {/each}-->
    <!--        </T.Mesh>-->
    <!--      </Transform>-->
    <!--    </SheetObject>-->

    {#each [-9.63, -5.78, -1.93, 1.98, 5.86, 9.7] as positionX}
      <T.Mesh position.x={positionX} position.z={0.4} castShadow>
        <RoundedPlaneGeometry args={[3.5, 4.9, 0.2]} />
        {#each ["/policy_fascist.png", "/policy_backcover.png", "/policy_side.png"] as material, i}
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
    {/each}
  </T.Group>

  <T.Group position.x={-17} position.z={0.2}>
    <Deck
      policies={[
        "liberal",
        "fascist",
        "liberal",
        "fascist",
        "fascist",
        "fascist",
        "liberal",
        "fascist",
        "fascist",
        "liberal",
        "fascist",
        "fascist",
      ]}
      type="draw"
    />
  </T.Group>

  <!--  <T.Group position.x={-17} position.z={0.2}>-->
  <!--    <T.Mesh position.y={-0.25} castShadow receiveShadow>-->
  <!--      <RoundedPlaneGeometry args={[4.48, 6.4, 0.05]} />-->
  <!--      {#each ["/pile_draw.png", "/pile_draw.png", "#fff"] as material, i}-->
  <!--        {#if material.startsWith("/")}-->
  <!--          {#await useTexture(material) then texture}-->
  <!--            <T.MeshStandardMaterial-->
  <!--              map={texture}-->
  <!--              attach={(parent, self) => {-->
  <!--                if (!Array.isArray(parent.material)) {-->
  <!--                  parent.material = []-->
  <!--                }-->
  <!--                parent.material.splice(i, 0, self)-->
  <!--              }}-->
  <!--            />-->
  <!--          {/await}-->
  <!--        {:else}-->
  <!--          <T.MeshStandardMaterial-->
  <!--            color={material}-->
  <!--            attach={(parent, self) => {-->
  <!--              if (!Array.isArray(parent.material)) {-->
  <!--                parent.material = []-->
  <!--              }-->
  <!--              parent.material.splice(i, 0, self)-->
  <!--            }}-->
  <!--          />-->
  <!--        {/if}-->
  <!--      {/each}-->
  <!--    </T.Mesh>-->
  <!--    <T.Group position.z={0.125}>-->
  <!--      {#each Array(17) as _, i}-->
  <!--        <T.Mesh position.z={0.2 * i} rotation.y={DEG2RAD * 180} castShadow>-->
  <!--          <RoundedPlaneGeometry args={[3.5, 4.9, 0.2]} />-->
  <!--          {#each ["/policy_fascist.png", "/policy_backcover.png", "/policy_side.png"] as material, i}-->
  <!--            {#if material.startsWith("/")}-->
  <!--              {#await useTexture(material) then texture}-->
  <!--                <T.MeshStandardMaterial-->
  <!--                  map={texture}-->
  <!--                  attach={(parent, self) => {-->
  <!--                    if (!Array.isArray(parent.material)) {-->
  <!--                      parent.material = []-->
  <!--                    }-->
  <!--                    parent.material.splice(i, 0, self)-->
  <!--                  }}-->
  <!--                />-->
  <!--              {/await}-->
  <!--            {:else}-->
  <!--              <T.MeshStandardMaterial-->
  <!--                color={material}-->
  <!--                attach={(parent, self) => {-->
  <!--                  if (!Array.isArray(parent.material)) {-->
  <!--                    parent.material = []-->
  <!--                  }-->
  <!--                  parent.material.splice(i, 0, self)-->
  <!--                }}-->
  <!--              />-->
  <!--            {/if}-->
  <!--          {/each}-->
  <!--        </T.Mesh>-->
  <!--      {/each}-->
  <!--    </T.Group>-->
  <!--  </T.Group>-->
  <!--    </Transform>-->
  <!--  </SheetObject>-->

  <T.Group position.x={17} position.z={0.2}>
    <Deck policies={["liberal", "liberal", "fascist", "fascist", "fascist"]} type="discard" />
  </T.Group>

  <!--  <RoundedPlane position.z={0.35} />-->
  <!--  <RoundedExtrudePlane position.z={0.35} />-->
  <!--  <RoundedBox position.z={0.35}>-->
  <!--    {#await useTexture("/policy_liberal.png") then texture}-->
  <!--      <T.MeshStandardMaterial map={texture} />-->
  <!--    {/await}-->
  <!--  </RoundedBox>-->

  <!--  <T.Mesh position.z={0.35}>-->
  <!--    <RoundedBoxGeometry args={[3.5, 4.9, 0.1]} radius={0.3} />-->
  <!--    {#await useTexture("/policy_liberal.png") then texture}-->
  <!--      <T.MeshStandardMaterial map={texture} />-->
  <!--    {/await}-->
  <!--  </T.Mesh>-->

  <!--  <T.Mesh position.z={5}>-->
  <!--    <RoundedBoxGeometry args={[3.5, 4.9, 1]} radius={0.3} creaseAngle={0.1} />-->
  <!--    <T.MeshPhongMaterial color="hotpink" />-->
  <!--  </T.Mesh>-->
</Align>

<!--<T.Mesh rotation.x={-Math.PI / 2} receiveShadow>-->
<!--  <T.CircleGeometry args={[4, 40]} />-->
<!--  <T.MeshStandardMaterial color="white" />-->
<!--</T.Mesh>-->
