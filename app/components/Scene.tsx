import { useControls } from 'leva'
import { Environment } from '@react-three/drei'
import { DirectionalLight } from './DirectionalLight'
import PointLight from './PointLight'

export default function Scene() {
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

  return (
    <>
      {environmentSettings.enabled && (
        <Environment path="/environment-maps/field/" files="2k.hdr" />
      )}

      {/*
        All Directional Lights in here
        With the Leva controls
      */}
      <DirectionalLight />

      {/*
        All Point Lights in here
        With the Leva controls
      */}
      <PointLight />

      {/* Add soft ambient light to simulate light bounce */}
      <ambientLight intensity={ambientLightSettings.intensity} />
    </>
  )
}
