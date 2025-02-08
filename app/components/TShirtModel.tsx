import { GLTF } from 'three-stdlib'
import * as THREE from 'three'
import { useGLTF, CameraControls } from '@react-three/drei'
import { useTextures } from '~/hooks/use-textures'
import { useRef, useMemo } from 'react'
import { useLayoutEffect } from '@tanstack/react-router'
import { MaterialType } from '~/hooks/use-textures'

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
  },
) {
  // Using Draco compression to reduce the file size of the model
  const { nodes, materials } = useGLTF(
    '/models/t-shirt.glb',
    '/draco',
  ) as GLTFResult

  const { cameraControls, selectedMaterial, ...restProps } = props

  const { textures, textureDetails } = useTextures()
  const groupRef = useRef<THREE.Group>(null)

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

  // Decided to use meshPhysicalMaterial for the t-shirt
  // This is because it's the most realistic material for fabric
  // It has a lot of settings to play around with
  const material = useMemo(() => {
    if (selectedMaterial) {
      const selectedTextures = textures[selectedMaterial]
      return new THREE.MeshPhysicalMaterial({
        map: selectedTextures.albedo,
        normalMap: selectedTextures.normal,
        normalScale: new THREE.Vector2(2, 2),
        roughnessMap: selectedTextures.roughness,
        sheenRoughnessMap: selectedTextures.roughness,
        aoMap: selectedTextures.ao,
        metalnessMap: selectedTextures.metallic,
        metalness: textureDetails[selectedMaterial].metalness,
        roughness: textureDetails[selectedMaterial].roughness,
        sheen: textureDetails[selectedMaterial].sheen,
        sheenColor: textureDetails[selectedMaterial].sheenColor,
        bumpMap: selectedTextures.height,
        bumpScale: textureDetails[selectedMaterial].bumpScale,
        // displacementMap: selectedTextures.height,
        // displacementScale: textureDetails[selectedMaterial].displacementScale,
        // displacementBias: textureDetails[selectedMaterial].displacementBias,
        thicknessMap: selectedTextures.height,
        thickness: 1000,
      })
    }

    return new THREE.MeshPhysicalMaterial({
      color: '#ffffff',
      roughness: 0.5,
      metalness: 0,
      sheen: 1,
    })
  }, [selectedMaterial, textures])

  // Cleanup material on unmount or when it changes
  useLayoutEffect(() => {
    return () => {
      material.dispose()
    }
  }, [material])

  return (
    <group {...restProps} dispose={null} ref={groupRef}>
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
    </group>
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

  return (
    <mesh
      {...props}
      ref={ref}
      onClick={(e) => {
        e.stopPropagation()
        props.zoomToFit(ref, props.azimuth)
      }}
    />
  )
}

// Preload the model
useGLTF.preload('/models/t-shirt.glb')
