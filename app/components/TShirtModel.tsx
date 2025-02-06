import { GLTF } from 'three-stdlib'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'

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

  return (
    <group {...props} dispose={null}>
      <mesh
        name="__var_neckline__neck_v__*back_pannel"
        castShadow
        receiveShadow
        geometry={nodes['__var_neckline__neck_v__*back_pannel'].geometry}
        material={materials.Back}
        position={[0, -1.152, 0.065]}
        userData={{ name: '__var_neckline__neck_v__*back_pannel' }}
      />
      <mesh
        name="__var_neckline_neck_v__*front_panel"
        castShadow
        receiveShadow
        geometry={nodes['__var_neckline_neck_v__*front_panel'].geometry}
        material={materials.Front}
        position={[0, -1.152, 0.065]}
        userData={{ name: '__var_neckline_neck_v__*front_panel' }}
      />
      <mesh
        name="__var_neckline_neck_v__*neck_rim"
        castShadow
        receiveShadow
        geometry={nodes['__var_neckline_neck_v__*neck_rim'].geometry}
        material={materials.Accessories}
        position={[0, -1.152, 0.065]}
        userData={{ name: '__var_neckline_neck_v__*neck_rim' }}
      />
      <mesh
        name="shirt_interior"
        castShadow
        receiveShadow
        geometry={nodes.shirt_interior.geometry}
        material={materials.Interior}
        position={[0, -1.152, 0.065]}
        userData={{ name: 'shirt_interior' }}
      />
      <mesh
        name="left_sleeve"
        castShadow
        receiveShadow
        geometry={nodes.left_sleeve.geometry}
        material={materials.Accessories}
        position={[0, -1.152, 0.065]}
        userData={{ name: 'left_sleeve' }}
      />
      <mesh
        name="right_sleeve"
        castShadow
        receiveShadow
        geometry={nodes.right_sleeve.geometry}
        material={materials.Accessories}
        position={[0, -1.152, 0.065]}
        userData={{ name: 'right_sleeve' }}
      />
    </group>
  )
}

useGLTF.preload('/models/t-shirt.glb')
