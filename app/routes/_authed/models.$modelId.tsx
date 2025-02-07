import { createFileRoute } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import { useConvexQuery, useConvexMutation } from '@convex-dev/react-query'
import { Id } from 'convex/_generated/dataModel'
import { Canvas } from '@react-three/fiber'
import { BakeShadows, Preload } from '@react-three/drei'
import { Loader2 } from 'lucide-react'
import * as THREE from 'three'
import { Suspense, useCallback } from 'react'
import { useControls } from 'leva'
import Scene from '~/components/Scene'
import PostProcessing from '~/components/PostProcessing'
import { MaterialType } from '~/hooks/use-textures'
import TextureSelector from '~/components/TextureSelector'

/**
 * This route is used to display a specific t-shirt model.
 * It is wrapped in the _authed route so only authenticated users can access it.
 * It uses the modelId from the URL to fetch the model from the database.
 * In the future this could be used for sharing models with other users and allowing them to edit them.
 */
export const Route = createFileRoute('/_authed/models/$modelId')({
  component: RouteComponent,
})

/**
 * The main component for the model route.
 * It fetches the model data from Convex and displays it.
 * @returns The model component
 */
function RouteComponent() {
  const params = Route.useParams()
  const modelId = params.modelId as Id<'models'>
  const model = useConvexQuery(api.models.getById, { modelId })
  const updateMaterial = useConvexMutation(api.models.updateMaterial)

  const handleMaterialChange = useCallback(
    async (material: MaterialType) => {
      await updateMaterial({
        modelId,
        material,
      })
    },
    [modelId, updateMaterial],
  )

  // Add Leva controls for renderer settings
  const rendererSettings = useControls(
    'Renderer',
    {
      preserveDrawingBuffer: {
        value: true,
        label: 'Preserve Drawing Buffer',
      },
      // Made this false since we are using SMAA post-processing
      antialias: {
        value: false,
        label: 'Antialiasing',
      },
      depth: {
        value: true,
        label: 'Depth Buffer',
      },
      shadows: {
        value: true,
        label: 'Enable Shadows',
      },
      // Happy with either ACES Filmic or Reinhard, although to me
      // ACES Filmic looks better
      toneMapping: {
        value: THREE.ACESFilmicToneMapping,
        options: {
          'ACES Filmic': THREE.ACESFilmicToneMapping,
          Reinhard: THREE.ReinhardToneMapping,
          Linear: THREE.LinearToneMapping,
          Cineon: THREE.CineonToneMapping,
        },
        label: 'Tone Mapping',
      },
      toneMappingExposure: {
        value: 3,
        min: 0,
        max: 5,
        step: 0.1,
        label: 'Exposure',
      },
    },
    { collapsed: true },
  )

  // If the model data hasn't loaded yet, show a loading spinner
  if (!model) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin w-10 h-10" />
      </div>
    )
  }

  // Once we have the model data, display it
  return (
    <div className="h-full w-full relative">
      <TextureSelector
        selectedMaterial={model.material as MaterialType | undefined}
        onSelectMaterial={handleMaterialChange}
      />

      <Canvas
        dpr={[1, 2]}
        shadows={rendererSettings.shadows}
        gl={{
          preserveDrawingBuffer: rendererSettings.preserveDrawingBuffer,
          antialias: rendererSettings.antialias,
          toneMapping: rendererSettings.toneMapping,
          toneMappingExposure: rendererSettings.toneMappingExposure,
          depth: rendererSettings.depth,
          powerPreference: 'high-performance',
        }}
      >
        {/*
        Added a scene component to the canvas so we can control the camera and light
        This is a great way to start off a scene and add more complexity later
      */}
        <Suspense fallback={null}>
          <Scene
            selectedMaterial={model.material as MaterialType | undefined}
          />
          <Preload all />
        </Suspense>

        {/*
        Moved the post-processing into a separate component
        This is a great way to keep the scene clean and add more complexity later
      */}
        <PostProcessing />

        {/*
        Added a bake shadows component to the scene so
        the shadows are baked and the scene is rendered faster
        This is great for performance if the scene is static
        */}
        <BakeShadows />
      </Canvas>
    </div>
  )
}
