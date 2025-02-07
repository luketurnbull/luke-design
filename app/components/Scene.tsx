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
  const lightRef = useRef<THREE.DirectionalLight>(null)

  // Get light settings from Leva
  const lightSettings = useControls(
    'Light',
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

  // Add light helper when showHelper is true
  useHelper(
    lightSettings.showHelper
      ? (lightRef as React.MutableRefObject<THREE.DirectionalLight>)
      : null,
    THREE.DirectionalLightHelper,
    1,
    'red',
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
        ref={lightRef}
        intensity={lightSettings.intensity}
        position={[
          lightSettings.positionX,
          lightSettings.positionY,
          lightSettings.positionZ,
        ]}
        castShadow
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
