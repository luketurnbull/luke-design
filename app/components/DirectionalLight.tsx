import { useControls } from 'leva'
import { useRef } from 'react'
import * as THREE from 'three'
import { useHelper } from '@react-three/drei'

export const DirectionalLight = () => {
  const directionalLightRef = useRef<THREE.DirectionalLight>(null)

  // Get light settings from Leva
  const directionalLightSettings = useControls(
    'Directional Light',
    {
      intensity: {
        value: 5.0,
        min: 0,
        max: 5,
        step: 0.1,
        label: 'Intensity',
      },
      position: {
        x: 0,
        y: 7,
        z: 1,
      },
      showHelper: {
        value: false,
        label: 'Show Helper',
      },
    },
    { collapsed: true },
  )

  // Add light helpers when showHelper is true
  useHelper(
    directionalLightSettings.showHelper
      ? (directionalLightRef as React.MutableRefObject<THREE.DirectionalLight>)
      : null,
    THREE.DirectionalLightHelper,
    1,
    'red',
  )

  return (
    <directionalLight
      ref={directionalLightRef}
      intensity={directionalLightSettings.intensity}
      position={[
        directionalLightSettings.position.x,
        directionalLightSettings.position.y,
        directionalLightSettings.position.z,
      ]}
      castShadow
    />
  )
}
