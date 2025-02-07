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
    console.log('zoomToFit', ref, azimuth)
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
      <Mesh
        name="__var_neckline__neck_v__*back_pannel"
        geometry={nodes['__var_neckline__neck_v__*back_pannel'].geometry}
        position={[0, -1.152, 0.065]}
        zoomToFit={zoomToFit}
        azimuth={Math.PI}
      >
        <meshPhysicalMaterial
          map={textures.denim.albedo}
          normalMap={textures.denim.normal}
          roughnessMap={textures.denim.roughness}
          aoMap={textures.denim.ao}
          metalnessMap={textures.denim.metallic}
        />
      </Mesh>
      <Mesh
        name="__var_neckline_neck_v__*front_panel"
        geometry={nodes['__var_neckline_neck_v__*front_panel'].geometry}
        position={[0, -1.152, 0.065]}
        zoomToFit={zoomToFit}
        azimuth={0}
      >
        <meshPhysicalMaterial
          map={textures['houndstooth-fabric-weave'].albedo}
          normalMap={textures['houndstooth-fabric-weave'].normal}
          roughnessMap={textures['houndstooth-fabric-weave'].roughness}
          aoMap={textures['houndstooth-fabric-weave'].ao}
          metalnessMap={textures['houndstooth-fabric-weave'].metallic}
        />
      </Mesh>
      <Mesh
        name="__var_neckline_neck_v__*neck_rim"
        geometry={nodes['__var_neckline_neck_v__*neck_rim'].geometry}
        position={[0, -1.152, 0.065]}
        zoomToFit={zoomToFit}
      >
        <meshPhysicalMaterial
          map={textures.denim.albedo}
          normalMap={textures.denim.normal}
          roughnessMap={textures.denim.roughness}
          aoMap={textures.denim.ao}
          metalnessMap={textures.denim.metallic}
        />
      </Mesh>
      <Mesh
        name="shirt_interior"
        geometry={nodes.shirt_interior.geometry}
        position={[0, -1.152, 0.065]}
        zoomToFit={zoomToFit}
      >
        <meshPhysicalMaterial
          map={textures.denim.albedo}
          normalMap={textures.denim.normal}
          roughnessMap={textures.denim.roughness}
          aoMap={textures.denim.ao}
          metalnessMap={textures.denim.metallic}
        />
      </Mesh>
      <Mesh
        name="left_sleeve"
        geometry={nodes.left_sleeve.geometry}
        position={[0, -1.152, 0.065]}
        zoomToFit={zoomToFit}
      >
        <meshPhysicalMaterial
          map={textures['red-plaid'].albedo}
          normalMap={textures['red-plaid'].normal}
          roughnessMap={textures['red-plaid'].roughness}
          aoMap={textures['red-plaid'].ao}
          metalnessMap={textures['red-plaid'].metallic}
        />
      </Mesh>
      <Mesh
        name="right_sleeve"
        geometry={nodes.right_sleeve.geometry}
        position={[0, -1.152, 0.065]}
        zoomToFit={zoomToFit}
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
      </Mesh>
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
    >
      {props.children}
    </mesh>
  )
}

// Preload the model
useGLTF.preload('/models/t-shirt.glb')
