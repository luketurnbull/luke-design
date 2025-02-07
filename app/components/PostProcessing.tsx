import {
  EffectComposer,
  SMAA,
  BrightnessContrast,
  Bloom,
} from '@react-three/postprocessing'
import { useControls } from 'leva'

export default function PostProcessing() {
  // Add Leva controls for post-processing
  const postProcessingSettings = useControls(
    'Post Processing',
    {
      bloomEnabled: {
        value: true,
        label: 'Enable Bloom',
      },
      bloomIntensity: {
        value: 0.5,
        min: 0,
        max: 2,
        step: 0.1,
        label: 'Bloom Intensity',
      },
      bloomLuminanceThreshold: {
        value: 0.9,
        min: 0,
        max: 2,
        step: 0.1,
        label: 'Luminance Threshold',
      },
      bloomLuminanceSmoothing: {
        value: 0.025,
        min: 0,
        max: 1,
        step: 0.001,
        label: 'Luminance Smoothing',
      },
      brightness: {
        value: 0.02,
        min: -1,
        max: 1,
        step: 0.01,
        label: 'Brightness',
      },
      contrast: {
        value: 0.05,
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

      <>
        {postProcessingSettings.bloomEnabled && (
          <Bloom
            intensity={postProcessingSettings.bloomIntensity}
            luminanceThreshold={postProcessingSettings.bloomLuminanceThreshold}
            luminanceSmoothing={postProcessingSettings.bloomLuminanceSmoothing}
            height={300}
          />
        )}
      </>

      <BrightnessContrast
        brightness={postProcessingSettings.brightness}
        contrast={postProcessingSettings.contrast}
      />
    </EffectComposer>
  )
}
