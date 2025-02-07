import { createFileRoute } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import { useQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { Id } from 'convex/_generated/dataModel'
import { Canvas } from '@react-three/fiber'
import { BakeShadows, Preload } from '@react-three/drei'
import { Loader2 } from 'lucide-react'
import * as THREE from 'three'
import { Suspense } from 'react'
import { useControls } from 'leva'
import Scene from '~/components/Scene'
import PostProcessing from '~/components/PostProcessing'

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
  const { data: model } = useQuery(
    convexQuery(api.models.getById, {
      modelId: params.modelId as Id<'models'>,
    }),
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
      <Textures />
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
          <Scene />
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

// Material options with their display names and paths
const MATERIALS = [
  {
    id: 'denim',
    name: 'Denim',
    preview: '/material/denim/albedo.png',
  },
  {
    id: 'red-plaid',
    name: 'Red Plaid',
    preview: '/material/red-plaid/albedo.png',
  },
  {
    id: 'houndstooth-fabric-weave',
    name: 'Houndstooth',
    preview: '/material/houndstooth-fabric-weave/albedo.png',
  },
] as const

function Textures() {
  return (
    <div className="absolute flex flex-col gap-2 top-3 left-3 z-10">
      {MATERIALS.map((material) => (
        <button
          key={material.id}
          className="w-16 h-16 rounded-lg overflow-hidden border-2 border-white/20 hover:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/60 focus-visible:ring-2 focus-visible:ring-white/60 transition-colors"
          style={{
            backgroundImage: `url(${material.preview})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          aria-label={`Select ${material.name} texture`}
          onClick={() => {
            // TODO: Implement texture selection
            console.log(`Selected ${material.id} texture`)
          }}
        />
      ))}
    </div>
  )
}
