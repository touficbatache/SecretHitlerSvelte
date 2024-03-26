<script lang="ts">
  import { T, useThrelte } from "@threlte/core"
  import {
    Align,
    interactivity,
    OrbitControls,
    Portal,
    TransformControls,
    useTexture,
  } from "@threlte/extras"
  import type { CameraHelper, DirectionalLightHelper } from "three"
  import { DEG2RAD } from "three/src/math/MathUtils"

  import Deck from "$lib/components/three/Deck.svelte"
  import RoundedPlaneGeometry from "$lib/components/three/RoundedPlaneGeometry.svelte"
  import type { GameDataPolicies } from "$lib/game_data"
  import { attachMaterial } from "$lib/three_helper"

  export let disableRotation: boolean = false
  export let electionTracker: number = 0
  export let playerCount: number = 5
  export let policies: GameDataPolicies | undefined = undefined

  const { size, scene } = useThrelte()
  const D = 10

  let helperA: DirectionalLightHelper
  let helperB: DirectionalLightHelper

  let perspectiveCameraHelper: CameraHelper
  let orthographicCameraHelper: CameraHelper

  const electionTrackerX: number[] = [-4.09, -1.475, 1.14, 3.755] //x diff = 2.615

  // TODO: temp fix
  // $: aspectRatio = $size.width / $size.height
  let aspectRatio: number = 1

  interactivity()
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
  zoom={16}
>
  <OrbitControls
    enableRotate={!disableRotation}
    on:change={({ target }) => {
      //target.target.clamp(new Vector3(-2, -2, -2), new Vector3(2, 2, 2))
      //console.log("gg", target)
    }}
  />
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

<Align rotation.x={DEG2RAD * -90}>
  <T.Group position.z={0.15}>
    <T.Mesh castShadow receiveShadow>
      <T.BoxGeometry args={[28, 10, 0.3]} />
      {#each ["#363835", "#363835", "#363835", "#363835", "/board_liberal.png", "/board_liberal_back.png"] as material, i}
        {#if material.startsWith("/")}
          {#await useTexture(material) then texture}
            <T.MeshStandardMaterial
              map={texture}
              attach={(parent, self) => attachMaterial(parent, self, i)}
            />
          {/await}
        {:else}
          <T.MeshStandardMaterial
            color={material}
            attach={(parent, self) => attachMaterial(parent, self, i)}
          />
        {/if}
      {/each}
    </T.Mesh>

    <!--    <SheetObject key="Box" let:Transform let:Sync>-->
    <!--      <Transform>-->
    <T.Mesh
      position.x={electionTrackerX[electionTracker]}
      position.y={-3.4}
      position.z={0.25}
      rotation.x={DEG2RAD * 90}
      castShadow
    >
      <T.CylinderGeometry args={[0.5, 0.5, 0.2, 50]} />
      <T.MeshStandardMaterial color="#223a7d" />
    </T.Mesh>
    <!--      </Transform>-->
    <!--    </SheetObject>-->

    {#each [-7.7, -3.85, 0, 3.85, 7.7] as positionX, policyIndex}
      {#if policyIndex < (policies?.board?.liberal ?? 0)}
        <T.Mesh position.x={positionX} position.z={0.25} castShadow>
          <RoundedPlaneGeometry args={[3.5, 4.9, 0.2]} />
          {#each ["/policy_liberal.png", "/policy_backcover.png", "/policy_side.png"] as material, i}
            {#if material.startsWith("/")}
              {#await useTexture(material) then texture}
                <T.MeshStandardMaterial
                  map={texture}
                  attach={(parent, self) => attachMaterial(parent, self, i)}
                />
              {/await}
            {:else}
              <T.MeshStandardMaterial
                color={material}
                attach={(parent, self) => attachMaterial(parent, self, i)}
              />
            {/if}
          {/each}
        </T.Mesh>
      {/if}
    {/each}
  </T.Group>

  <!--  <SheetObject-->
  <!--    key="Box"-->
  <!--    let:Transform-->
  <!--    let:Sync-->
  <!--  >-->
  <!--    <Transform>-->
  <T.Group position.y={-12} position.z={0.15}>
    <T.Mesh castShadow receiveShadow>
      <T.BoxGeometry args={[28, 10, 0.3]} />
      {#each ["#363835", "#363835", "#363835", "#363835", playerCount < 7 ? "/highcontrast_board_fascist_5_6.png" : playerCount < 9 ? "/highcontrast_board_fascist_7_8.png" : "/highcontrast_board_fascist_9_10.png", "/board_fascist_back.png"] as material, i}
        {#if material.startsWith("/")}
          {#await useTexture(material) then texture}
            <T.MeshStandardMaterial
              map={texture}
              attach={(parent, self) => attachMaterial(parent, self, i)}
            />
          {/await}
        {:else}
          <T.MeshStandardMaterial
            color={material}
            attach={(parent, self) => attachMaterial(parent, self, i)}
          />
        {/if}
      {/each}
    </T.Mesh>

    {#each [-9.63, -5.78, -1.93, 1.98, 5.86, 9.7] as positionX, policyIndex}
      {#if policyIndex < (policies?.board?.fascist ?? 0)}
        <T.Mesh position.x={positionX} position.z={0.25} castShadow>
          <RoundedPlaneGeometry args={[3.5, 4.9, 0.2]} />
          {#each ["/policy_fascist.png", "/policy_backcover.png", "/policy_side.png"] as material, i}
            {#if material.startsWith("/")}
              {#await useTexture(material) then texture}
                <T.MeshStandardMaterial
                  map={texture}
                  attach={(parent, self) => attachMaterial(parent, self, i)}
                />
              {/await}
            {:else}
              <T.MeshStandardMaterial
                color={material}
                attach={(parent, self) => attachMaterial(parent, self, i)}
              />
            {/if}
          {/each}
        </T.Mesh>
      {/if}
    {/each}
  </T.Group>
  <!--    </Transform>-->
  <!--  </SheetObject>-->

  <T.Group position.x={-17} position.z={0.1}>
    <Deck policies={policies?.drawPile} type="draw" />
  </T.Group>

  <T.Group position.x={17} position.z={0.1}>
    <Deck policies={Array(policies?.discardPileCount())} type="discard" />
  </T.Group>
</Align>
