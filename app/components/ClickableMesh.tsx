import { useRef, useState } from 'react'
import * as THREE from 'three'
import { animated } from '@react-spring/three'
import { useCursor } from '@react-three/drei'

type MeshProps = JSX.IntrinsicElements['mesh'] & {
  zoomToFit: (
    ref: React.RefObject<THREE.Mesh | THREE.Group>,
    azimuth?: number,
  ) => void
  azimuth?: number
}

// Shared mesh component for the t-shirt model
// This is so I can easily manage the meshes and their properties
// I can also pass in the zoomToFit function to zoom to the mesh
// And the azimuth to rotate the mesh
const ClickableMesh = animated(
  ({ zoomToFit, azimuth, ...props }: MeshProps) => {
    const ref = useRef<THREE.Mesh>(null)
    const [hovered, setHovered] = useState(false)
    useCursor(hovered)

    return (
      <mesh
        {...props}
        ref={ref}
        onClick={(e) => {
          e.stopPropagation()
          zoomToFit(ref, azimuth)
        }}
        onPointerEnter={(e) => {
          e.stopPropagation()
          setHovered(true)
        }}
        onPointerLeave={(e) => {
          e.stopPropagation()
          setHovered(false)
        }}
        castShadow
        receiveShadow
      />
    )
  },
)

export default ClickableMesh
