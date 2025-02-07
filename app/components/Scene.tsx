import { useEffect, useRef, useState } from 'react'
import { useControls } from 'leva'
import { useHelper } from '@react-three/drei'
import * as THREE from 'three'
import { Environment, CameraControls } from '@react-three/drei'
import TShirtModel from './TShirtModel'

// Set up the Scene with light and camera controls
export default function Scene() {
  const cameraControlsRef = useRef<CameraControls>(null)
  const [controls, setControls] = useState<CameraControls | null>(null)
  const directionalLightRef = useRef<THREE.DirectionalLight>(null)
  const pointLightRef1 = useRef<THREE.PointLight>(null)
  const pointLightRef2 = useRef<THREE.PointLight>(null)

  // Get light settings from Leva
  const directionalLightSettings = useControls(
    'Directional Light',
    {
      intensity: {
        value: 0.4,
        min: 0,
        max: 5,
        step: 0.1,
        label: 'Intensity',
      },
      positionX: {
        value: -4,
        min: -10,
        max: 10,
        step: 0.1,
        label: 'Position X',
      },
      positionY: {
        value: 6.5,
        min: -10,
        max: 10,
        step: 0.1,
        label: 'Position Y',
      },
      positionZ: {
        value: -10,
        min: -10,
        max: 10,
        step: 0.1,
        label: 'Position Z',
      },
      showHelper: {
        value: false,
        label: 'Show Helper',
      },
    },
    { collapsed: true },
  )

  const ambientLightSettings = useControls(
    'Ambient Light',
    {
      intensity: {
        value: 0.2,
        min: 0,
        max: 1,
        step: 0.05,
        label: 'Intensity',
      },
    },
    { collapsed: true },
  )

  const pointLightSettings = useControls(
    'Point Lights',
    {
      intensity: {
        value: 0.2,
        min: 0,
        max: 1,
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
        value: 2,
        min: 0,
        max: 5,
        step: 0.1,
        label: 'Decay',
      },
      showHelpers: {
        value: false,
        label: 'Show Helpers',
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

  // Doing this so I can use the camera controls in the TShirtModel component
  // Without passing the ref to the component
  useEffect(() => {
    if (cameraControlsRef.current) {
      setControls(cameraControlsRef.current)
    }
  }, [cameraControlsRef.current])

  return (
    <>
      {/*
       Added a camera controls component to the scene so
       I can pan around the model with ease
       Added a smooth time for smoother camera movement
     */}
      <CameraControls
        ref={cameraControlsRef}
        makeDefault
        smoothTime={0.2}
        // Disable zoom functionality
        dollySpeed={0}
      />

      {/*
         Added heavy environment map for better lighting 
         Could creating a setting where users can choose their own environment map
         I have noticed an issue where the environment map is lighting
         up the t-shirt from the inside, will look into this if I have time.
       */}
      <Environment path="/environment-maps/field/" files="2k.hdr" />

      {/*
         Added a directional light to the scene for better lighting
         TODO: Add a point light to the scene for better lighting
       */}
      <directionalLight
        ref={directionalLightRef}
        intensity={directionalLightSettings.intensity}
        position={[
          directionalLightSettings.positionX,
          directionalLightSettings.positionY,
          directionalLightSettings.positionZ,
        ]}
        castShadow
      />

      {/* Add soft ambient light to simulate light bounce */}
      <ambientLight intensity={ambientLightSettings.intensity} />

      {/* Add point lights for more dynamic lighting */}
      <pointLight
        ref={pointLightRef1}
        position={[10, 5, 0]}
        intensity={pointLightSettings.intensity}
        distance={pointLightSettings.distance}
        decay={pointLightSettings.decay}
      />
      <pointLight
        ref={pointLightRef2}
        position={[-10, 5, 0]}
        intensity={pointLightSettings.intensity}
        distance={pointLightSettings.distance}
        decay={pointLightSettings.decay}
      />

      {/*
        Added the TShirtModel component to the scene
        This is where the model is rendered
        I have passed the camera controls to the component so we can pan around the model
      */}
      <TShirtModel cameraControls={controls} />
    </>
  )
}
