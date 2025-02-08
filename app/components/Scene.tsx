import { useEffect, useRef, useState } from 'react'
import { useControls } from 'leva'
import { Environment, CameraControls } from '@react-three/drei'
import TShirtModel from './TShirtModel'
import { DirectionalLight } from './DirectionalLight'
import PointLight from './PointLight'
import { MaterialType } from '~/hooks/use-textures'

type SceneProps = {
  selectedMaterial: MaterialType | undefined
  isChangingMaterial: boolean
}

// Set up the Scene with light and camera controls
export default function Scene({
  selectedMaterial,
  isChangingMaterial,
}: SceneProps) {
  const cameraControlsRef = useRef<CameraControls>(null)
  const [controls, setControls] = useState<CameraControls | null>(null)

  const ambientLightSettings = useControls(
    'Ambient Light',
    {
      intensity: {
        value: 0.6,
        min: 0,
        max: 1,
        step: 0.05,
        label: 'Intensity',
      },
    },
    { collapsed: true },
  )

  const environmentSettings = useControls(
    'Environment',
    {
      enabled: {
        value: false,
        label: 'Enable Environment Map',
      },
    },
    { collapsed: true },
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

      {environmentSettings.enabled && (
        <Environment path="/environment-maps/field/" files="2k.hdr" />
      )}

      <DirectionalLight />
      <PointLight />

      {/* Add soft ambient light to simulate light bounce */}
      <ambientLight intensity={ambientLightSettings.intensity} />

      {/*
        Added the TShirtModel component to the scene
        This is where the model is rendered
        I have passed the camera controls to the component so we can pan around the model
      */}
      <TShirtModel
        cameraControls={controls}
        selectedMaterial={selectedMaterial}
        isChangingMaterial={isChangingMaterial}
      />
    </>
  )
}
