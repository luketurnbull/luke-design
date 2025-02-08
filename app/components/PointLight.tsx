import { useRef } from 'react'
import * as THREE from 'three'
import { useControls } from 'leva'
import { useHelper } from '@react-three/drei'

export default function PointLight() {
  const pointLightRef1 = useRef<THREE.PointLight>(null)
  const pointLightRef2 = useRef<THREE.PointLight>(null)

  const pointLightSettings = useControls(
    'Point Light 1',
    {
      intensity: {
        value: 1.5,
        min: 0,
        max: 4,
        step: 0.05,
        label: 'Intensity',
      },
      distance: {
        value: 0,
        min: 0,
        max: 100,
        step: 1,
        label: 'Distance',
      },
      decay: {
        value: 1.0,
        min: 0,
        max: 5,
        step: 0.1,
        label: 'Decay',
      },
      position: {
        x: 0.0,
        y: 2.0,
        z: 0.8,
      },
      showHelpers: {
        value: false,
        label: 'Show Helpers',
      },
    },
    { collapsed: true },
  )

  const pointLight2Settings = useControls(
    'Point Light 2',
    {
      intensity: {
        value: 1,
        min: 0,
        max: 4,
        step: 0.05,
        label: 'Intensity',
      },
      distance: {
        value: 0,
        min: 0,
        max: 100,
        step: 1,
        label: 'Distance',
      },
      decay: {
        value: 0.3,
        min: 0,
        max: 5,
        step: 0.1,
        label: 'Decay',
      },
      position: {
        x: -0.6,
        y: 0.4,
        z: -2.0,
      },
      showHelpers: {
        value: false,
        label: 'Show Helpers',
      },
    },
    { collapsed: true },
  )

  useHelper(
    pointLightSettings.showHelpers
      ? (pointLightRef1 as React.MutableRefObject<THREE.PointLight>)
      : null,
    THREE.PointLightHelper,
    0.5,
    'blue',
  )

  useHelper(
    pointLightSettings.showHelpers
      ? (pointLightRef2 as React.MutableRefObject<THREE.PointLight>)
      : null,
    THREE.PointLightHelper,
    0.5,
    'blue',
  )

  return (
    <>
      {/* Add point lights for more dynamic lighting */}
      <pointLight
        ref={pointLightRef1}
        position={[
          pointLightSettings.position.x,
          pointLightSettings.position.y,
          pointLightSettings.position.z,
        ]}
        intensity={pointLightSettings.intensity}
        distance={pointLightSettings.distance}
        decay={pointLightSettings.decay}
      />
      <pointLight
        ref={pointLightRef2}
        position={[
          pointLight2Settings.position.x,
          pointLight2Settings.position.y,
          pointLight2Settings.position.z,
        ]}
        intensity={pointLight2Settings.intensity}
        distance={pointLight2Settings.distance}
        decay={pointLight2Settings.decay}
      />
    </>
  )
}
