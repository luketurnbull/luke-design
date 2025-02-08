import { GLTF } from 'three-stdlib'
import * as THREE from 'three'
import { useGLTF, CameraControls } from '@react-three/drei'
import { useTextures } from '~/hooks/use-textures'
import { useRef, useMemo, useEffect } from 'react'
import { useLayoutEffect } from '@tanstack/react-router'
import { MaterialType } from '~/hooks/use-textures'
import { useSpring, animated } from '@react-spring/three'
import ClickableMesh from './ClickableMesh'
import useCamera from '~/hooks/use-camera'

type GLTFResult = GLTF & {
  nodes: {
    ['__var_neckline__neck_v__*back_pannel']: THREE.Mesh
    ['__var_neckline_neck_v__*front_panel']: THREE.Mesh
    ['__var_neckline_neck_v__*neck_rim']: THREE.Mesh
    shirt_interior: THREE.Mesh
    left_sleeve: THREE.Mesh
    right_sleeve: THREE.Mesh
  }
  materials: {
    Back: THREE.MeshPhysicalMaterial
    Front: THREE.MeshPhysicalMaterial
    Accessories: THREE.MeshStandardMaterial
    Interior: THREE.MeshStandardMaterial
  }
}

// The TShirtModel component
// This component is used to display the t-shirt model
// I used gltf to r3f to deconstruct the model, so it's easier to access the nodes and materials
// in a modular type friendly way
export default function TShirtModel(
  props: JSX.IntrinsicElements['group'] & {
    cameraControls: React.RefObject<CameraControls>
    selectedMaterial: MaterialType | undefined
    isChangingMaterial: boolean
  },
) {
  // Using Draco compression to reduce the file size of the model
  const { nodes, materials } = useGLTF(
    '/models/t-shirt.glb',
    '/draco',
  ) as GLTFResult

  const { cameraControls, selectedMaterial, isChangingMaterial, ...restProps } =
    props

  const { textures } = useTextures()
  const groupRef = useRef<THREE.Group>(null)
  const prevMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null)

  // Fade the model out when the material is changing
  // This is so it doesn't look jarring when the material changes
  const { opacity } = useSpring({
    opacity: isChangingMaterial ? 0 : 1,
    config: {
      mass: 0.1,
      tension: 100,
      friction: 50,
    },
  })

  // Keep the model spinning when the material is changing
  const { rotationY } = useSpring({
    from: { rotationY: 0 },
    to: async (next) => {
      while (isChangingMaterial) {
        await next({ rotationY: rotationY.get() + Math.PI * 2 })
      }
    },
    config: {
      mass: 1,
      tension: 80,
      friction: 10,
    },
  })

  const { zoomToMesh } = useCamera({ cameraControlsRef: cameraControls })

  // Zoom to fit the model to the center of the screen when the component mounts
  useEffect(() => {
    zoomToMesh(groupRef)
  }, [cameraControls, groupRef.current])

  // Using meshPhysicalMaterial for the t-shirt
  // This is because it's the most realistic material for fabric
  // It has a lot of settings to play around with
  // Especially "sheen" which is good for fabric surfaces
  const material = useMemo(() => {
    const materialProps: THREE.MeshPhysicalMaterialParameters = {
      transparent: true,
      opacity: 1,
      reflectivity: 0,
      metalness: 0,
      roughness: 1,
      sheen: 1,
      sheenColor: '#ffffff',
      sheenRoughness: 1,
      bumpScale: 1000,
    }

    if (selectedMaterial) {
      // Add the texture map
      materialProps.map = textures[selectedMaterial].albedo

      // Add the normal map
      materialProps.normalMap = textures[selectedMaterial].normal
      materialProps.normalScale = new THREE.Vector2(2, 2)

      // Add the ao map
      materialProps.aoMap = textures[selectedMaterial].ao
      materialProps.aoMapIntensity = 1

      // Add the metalness map
      materialProps.metalnessMap = textures[selectedMaterial].metallic
      materialProps.metalness = 0

      // Add the bump map
      materialProps.bumpMap = textures[selectedMaterial].height
      materialProps.bumpScale = 1000

      // Add the roughness map if it exists
      if (textures[selectedMaterial].roughness) {
        materialProps.roughnessMap = textures[selectedMaterial].roughness
        materialProps.sheenRoughnessMap = textures[selectedMaterial].roughness
        materialProps.roughness = 1
      }
    } else {
      // If no material is selected, use the default material for the white t-shirt
      materialProps.color = '#ffffff'
    }

    const newMaterial = new THREE.MeshPhysicalMaterial(materialProps)

    // Store the previous material for cleanup
    if (prevMaterialRef.current) {
      prevMaterialRef.current.dispose()
    }
    prevMaterialRef.current = newMaterial

    return newMaterial
  }, [selectedMaterial, textures])

  // Cleanup material on unmount
  useLayoutEffect(() => {
    return () => {
      material.dispose()

      if (prevMaterialRef.current) {
        prevMaterialRef.current.dispose()
      }
    }
  }, [material])

  // Display all parts of the t-shirt as r3f meshes,
  // I find it much easier to manage and modify the model this way
  // It's easy to read and understand and also modularises the code
  return (
    <animated.group
      {...restProps}
      dispose={null}
      ref={groupRef}
      rotation-y={rotationY}
    >
      <ClickableMesh
        name="__var_neckline__neck_v__*back_pannel"
        geometry={nodes['__var_neckline__neck_v__*back_pannel'].geometry}
        position={[0, -1.152, 0.065]}
        zoomToFit={zoomToMesh}
        azimuth={Math.PI}
        material={material}
        material-opacity={opacity}
      />
      <ClickableMesh
        name="__var_neckline_neck_v__*front_panel"
        geometry={nodes['__var_neckline_neck_v__*front_panel'].geometry}
        position={[0, -1.152, 0.065]}
        zoomToFit={zoomToMesh}
        azimuth={0}
        material={material}
        material-opacity={opacity}
      />
      <ClickableMesh
        name="__var_neckline_neck_v__*neck_rim"
        geometry={nodes['__var_neckline_neck_v__*neck_rim'].geometry}
        position={[0, -1.152, 0.065]}
        zoomToFit={zoomToMesh}
        material={material}
        material-opacity={opacity}
      />
      <ClickableMesh
        name="shirt_interior"
        geometry={nodes.shirt_interior.geometry}
        position={[0, -1.152, 0.065]}
        zoomToFit={zoomToMesh}
        material={material}
        material-opacity={opacity}
      />
      <ClickableMesh
        name="left_sleeve"
        geometry={nodes.left_sleeve.geometry}
        position={[0, -1.152, 0.065]}
        zoomToFit={zoomToMesh}
        material={material}
        material-opacity={opacity}
      />
      <ClickableMesh
        name="right_sleeve"
        geometry={nodes.right_sleeve.geometry}
        position={[0, -1.152, 0.065]}
        zoomToFit={zoomToMesh}
        material={material}
        material-opacity={opacity}
      />
    </animated.group>
  )
}

// Preload the model
useGLTF.preload('/models/t-shirt.glb')
