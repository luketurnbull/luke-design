import {
  EffectComposer,
  SMAA,
  BrightnessContrast,
} from '@react-three/postprocessing'
import { useControls } from 'leva'

export default function PostProcessing() {
  // Add Leva controls for post-processing
  const postProcessingSettings = useControls(
    'Post Processing',
    {
      brightness: {
        value: 0.07,
        min: -1,
        max: 1,
        step: 0.01,
        label: 'Brightness',
      },
      contrast: {
        value: 0.48,
        min: -1,
        max: 1,
        step: 0.01,
        label: 'Contrast',
      },
    },
    { collapsed: true },
  )

  return (
    <EffectComposer multisampling={0}>
      {/*
     Added a SMAA post-processing effect to the scene
     This is a simple anti-aliasing effect that helps with the quality of the scene
   */}
      <SMAA />

      <BrightnessContrast
        brightness={postProcessingSettings.brightness}
        contrast={postProcessingSettings.contrast}
      />
    </EffectComposer>
  )
}
