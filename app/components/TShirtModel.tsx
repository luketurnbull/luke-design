import { GLTF } from 'three-stdlib'
import * as THREE from 'three'
import { useGLTF, CameraControls } from '@react-three/drei'
import { useTextures } from '~/hooks/use-textures'
import { useRef } from 'react'
import { useLayoutEffect } from '@tanstack/react-router'

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
  },
) {
  // Using Draco compression to reduce the file size of the model
  const { nodes, materials } = useGLTF(
    '/models/t-shirt.glb',
    '/draco',
  ) as GLTFResult

  const cameraControls = props.cameraControls

  const textures = useTextures()
  const groupRef = useRef<THREE.Group>(null)
  const backPanelRef = useRef<THREE.Mesh>(null)

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
    cameraControls.fitToBox(box, true, {})
    cameraControls.rotatePolarTo(Math.PI / 2, true)
    if (azimuth) {
      cameraControls.rotateAzimuthTo(azimuth, true)
    }
  }

  // Decided to use meshPhysicalMaterial for the t-shirt
  // This is because it's the most realistic material for the t-shirt
  // It has a roughness map, normal map, and metallic map
  // It also has a sheen map, which is used to simulate the shine of the t-shirt
  // More to play around with to see what works best
  return (
    <group {...props} dispose={null} ref={groupRef}>
      <mesh
        name="__var_neckline__neck_v__*back_pannel"
        castShadow
        receiveShadow
        geometry={nodes['__var_neckline__neck_v__*back_pannel'].geometry}
        position={[0, -1.152, 0.065]}
        userData={{ name: '__var_neckline__neck_v__*back_pannel' }}
        ref={backPanelRef}
        onClick={() => {
          console.log('Back panel clicked')
          zoomToFit(backPanelRef, Math.PI)
        }}
      >
        <meshPhysicalMaterial
          map={textures.denim.albedo}
          normalMap={textures.denim.normal}
          roughnessMap={textures.denim.roughness}
          aoMap={textures.denim.ao}
          metalnessMap={textures.denim.metallic}
        />
      </mesh>
      <mesh
        name="__var_neckline_neck_v__*front_panel"
        castShadow
        receiveShadow
        geometry={nodes['__var_neckline_neck_v__*front_panel'].geometry}
        position={[0, -1.152, 0.065]}
        userData={{ name: '__var_neckline_neck_v__*front_panel' }}
      >
        <meshPhysicalMaterial
          map={textures['houndstooth-fabric-weave'].albedo}
          normalMap={textures['houndstooth-fabric-weave'].normal}
          roughnessMap={textures['houndstooth-fabric-weave'].roughness}
          aoMap={textures['houndstooth-fabric-weave'].ao}
          metalnessMap={textures['houndstooth-fabric-weave'].metallic}
        />
      </mesh>
      <mesh
        name="__var_neckline_neck_v__*neck_rim"
        castShadow
        receiveShadow
        geometry={nodes['__var_neckline_neck_v__*neck_rim'].geometry}
        position={[0, -1.152, 0.065]}
        userData={{ name: '__var_neckline_neck_v__*neck_rim' }}
      >
        <meshPhysicalMaterial
          map={textures.denim.albedo}
          normalMap={textures.denim.normal}
          roughnessMap={textures.denim.roughness}
          aoMap={textures.denim.ao}
          metalnessMap={textures.denim.metallic}
        />
      </mesh>
      <mesh
        name="shirt_interior"
        castShadow
        receiveShadow
        geometry={nodes.shirt_interior.geometry}
        position={[0, -1.152, 0.065]}
        userData={{ name: 'shirt_interior' }}
      >
        <meshPhysicalMaterial
          map={textures.denim.albedo}
          normalMap={textures.denim.normal}
          roughnessMap={textures.denim.roughness}
          aoMap={textures.denim.ao}
          metalnessMap={textures.denim.metallic}
        />
      </mesh>
      <mesh
        name="left_sleeve"
        castShadow
        receiveShadow
        geometry={nodes.left_sleeve.geometry}
        position={[0, -1.152, 0.065]}
        userData={{ name: 'left_sleeve' }}
      >
        <meshPhysicalMaterial
          map={textures['red-plaid'].albedo}
          normalMap={textures['red-plaid'].normal}
          roughnessMap={textures['red-plaid'].roughness}
          aoMap={textures['red-plaid'].ao}
          metalnessMap={textures['red-plaid'].metallic}
        />
      </mesh>
      <mesh
        name="right_sleeve"
        castShadow
        receiveShadow
        geometry={nodes.right_sleeve.geometry}
        position={[0, -1.152, 0.065]}
        userData={{ name: 'right_sleeve' }}
      >
        <meshPhysicalMaterial
          map={textures['red-plaid'].albedo}
          normalMap={textures['red-plaid'].normal}
          roughnessMap={textures['red-plaid'].roughness}
          aoMap={textures['red-plaid'].ao}
          metalnessMap={textures['red-plaid'].metallic}
          sheen={0.1}
          sheenColor={new THREE.Color(1, 0, 0)}
          sheenRoughness={2}
        />
      </mesh>
    </group>
  )
}

// Preload the model
useGLTF.preload('/models/t-shirt.glb')
