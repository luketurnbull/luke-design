import { GLTF } from 'three-stdlib'
import * as THREE from 'three'
import { useGLTF, CameraControls } from '@react-three/drei'
import { useTextures } from '~/hooks/use-textures'
import { useRef, useMemo } from 'react'
import { useLayoutEffect } from '@tanstack/react-router'
import { MaterialType } from '~/hooks/use-textures'
import { useSpring, animated } from '@react-spring/three'

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
    cameraControls: CameraControls | null
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

  // Add spinning animation
  const { rotationY } = useSpring({
    rotationY: isChangingMaterial ? 7 : 0,
    config: {
      mass: 2,
      tension: 45,
      friction: 15,
    },
  })

  // Zoom to fit the model to the center of the screen when the component mounts
  useLayoutEffect(() => {
    zoomToFit(groupRef)
  }, [cameraControls, groupRef.current])

  // Zoom to fit the passed in ref to the center of the screen
  // If an azimuth is passed in, rotate the camera to that azimuth
  // Always level out elevation
  const zoomToFit = (
    ref: React.RefObject<THREE.Group | THREE.Mesh>,
    azimuth?: number,
  ) => {
    if (!cameraControls || !ref.current) return

    const box = new THREE.Box3().setFromObject(ref.current)
    cameraControls.fitToBox(box, true, {
      paddingBottom: 0.1,
      paddingTop: 0.1,
      paddingLeft: 0.1,
      paddingRight: 0.1,
    })
    cameraControls.rotatePolarTo(Math.PI / 2, true)
    if (azimuth) {
      cameraControls.rotateAzimuthTo(azimuth, true)
    }
  }

  // Using meshPhysicalMaterial for the t-shirt
  // This is because it's the most realistic material for fabric
  // It has a lot of settings to play around with
  // Especially "sheen" which is good for fabric surfaces
  const material = useMemo(() => {
    const materialProps: THREE.MeshPhysicalMaterialParameters = {
      transparent: true,
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

  return (
    <animated.group
      {...restProps}
      dispose={null}
      ref={groupRef}
      rotation-y={rotationY.to((r) => r % (Math.PI * 2))}
    >
      <Mesh
        name="__var_neckline__neck_v__*back_pannel"
        geometry={nodes['__var_neckline__neck_v__*back_pannel'].geometry}
        position={[0, -1.152, 0.065]}
        zoomToFit={zoomToFit}
        azimuth={Math.PI}
        material={material}
      />
      <Mesh
        name="__var_neckline_neck_v__*front_panel"
        geometry={nodes['__var_neckline_neck_v__*front_panel'].geometry}
        position={[0, -1.152, 0.065]}
        zoomToFit={zoomToFit}
        azimuth={0}
        material={material}
      />
      <Mesh
        name="__var_neckline_neck_v__*neck_rim"
        geometry={nodes['__var_neckline_neck_v__*neck_rim'].geometry}
        position={[0, -1.152, 0.065]}
        zoomToFit={zoomToFit}
        material={material}
      />
      <Mesh
        name="shirt_interior"
        geometry={nodes.shirt_interior.geometry}
        position={[0, -1.152, 0.065]}
        zoomToFit={zoomToFit}
        material={material}
      />
      <Mesh
        name="left_sleeve"
        geometry={nodes.left_sleeve.geometry}
        position={[0, -1.152, 0.065]}
        zoomToFit={zoomToFit}
        material={material}
      />
      <Mesh
        name="right_sleeve"
        geometry={nodes.right_sleeve.geometry}
        position={[0, -1.152, 0.065]}
        zoomToFit={zoomToFit}
        material={material}
      />
    </animated.group>
  )
}

type MeshProps = JSX.IntrinsicElements['mesh'] & {
  zoomToFit: (
    ref: React.RefObject<THREE.Mesh | THREE.Group>,
    azimuth?: number,
  ) => void
  azimuth?: number
}

function Mesh(props: MeshProps) {
  const ref = useRef<THREE.Mesh>(null)
  const { zoomToFit, ...restProps } = props

  return (
    <mesh
      {...restProps}
      ref={ref}
      onClick={(e) => {
        e.stopPropagation()
        zoomToFit(ref, props.azimuth)
      }}
      castShadow
      receiveShadow
      key={props.name}
    />
  )
}

// Preload the model
useGLTF.preload('/models/t-shirt.glb')
