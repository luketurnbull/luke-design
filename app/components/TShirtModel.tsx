import { GLTF } from 'three-stdlib'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { useTextures } from '~/hooks/use-textures'

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

export default function TShirtModel(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF(
    '/models/t-shirt.glb',
    '/draco',
  ) as GLTFResult

  const textures = useTextures()

  return (
    <group {...props} dispose={null}>
      <mesh
        name="__var_neckline__neck_v__*back_pannel"
        castShadow
        receiveShadow
        geometry={nodes['__var_neckline__neck_v__*back_pannel'].geometry}
        position={[0, -1.152, 0.065]}
        userData={{ name: '__var_neckline__neck_v__*back_pannel' }}
      >
        <meshPhysicalMaterial
          color="red"
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
          color="blue"
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
          color="green"
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
          color="yellow"
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
          color="purple"
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
          //  color="purple"
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

useGLTF.preload('/models/t-shirt.glb')
