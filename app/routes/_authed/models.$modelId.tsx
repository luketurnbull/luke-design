import { createFileRoute } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import { useQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { Id } from 'convex/_generated/dataModel'
import { Canvas } from '@react-three/fiber'
import {
  BakeShadows,
  CameraControls,
  ContactShadows,
  Environment,
  RandomizedLight,
  AccumulativeShadows,
  Preload,
} from '@react-three/drei'
import { Loader2 } from 'lucide-react'
import TShirtModel from '~/components/TShirtModel'
import * as THREE from 'three'
import { useRef, useState, useEffect, Suspense } from 'react'
import {
  EffectComposer,
  SMAA,
  BrightnessContrast,
  SSAO,
  Bloom,
} from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

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
 * It fetches the model from the database and displays it.
 * @returns The model component
 */
function RouteComponent() {
  // Grab params from the route
  const params = Route.useParams()
  // Fetch the model from the Convex database
  const { data: model } = useQuery(
    convexQuery(api.models.getById, {
      modelId: params.modelId as Id<'models'>,
    }),
  )

  // If the model hasn't loaded yet, show a loading spinner
  if (!model) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin w-10 h-10" />
      </div>
    )
  }

  // If the model has loaded, display it
  return (
    <Canvas
      // Clamp the dpr to 1 or 2, anything more than 2 is too much
      dpr={[1, 2]}
      // Enable shadows for better lighting
      shadows={true}
      gl={{
        // Enable preserveDrawingBuffer for better performance
        preserveDrawingBuffer: true,
        // Using SMAA for better anti-aliasing
        antialias: false,
        // Apply Reinhard tone mapping for realistic lighting
        // Reinhard does seem dull compared to the other tone mapping options
        // toneMapping: THREE.ReinhardToneMapping,
        // Can also use ACESFilmicToneMapping for a more vibrant look
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 3,

        // Enable soft shadows, not sure how to do this in react-three-fiber
        // TODO: Figure out how to do this in react-three-fiber
        // shadowMap: {
        //   type: THREE.PCFSoftShadowMap,
        // },

        depth: true,
        powerPreference: 'high-performance',
      }}
    >
      {/*
        Added heavy environment map for better lighting 
        Could creating a setting where users can choose their own environment map
      */}
      <Environment
        path="/environment-maps/field/"
        files="2k.hdr"
        backgroundIntensity={0.5}
      />

      {/*
        Added a directional light to the scene for better lighting
        TODO: Add a point light to the scene for better lighting
      */}
      <directionalLight
        intensity={2}
        position={[-4, 6.5, 2.5]}
        castShadow
        shadow-camera-far={15}
        shadow-normalBias={0.027}
        shadow-bias={-0.004}
        shadow-mapSize={[512, 512]}
      />

      <Suspense fallback={null}>
        <Scene />
        <Preload all /> {/* Preload all assets */}
      </Suspense>

      {/* Bake shadows for performance, shadows won't be moving in this static scene */}
      <BakeShadows />

      {/* Post Processing Effects */}
      <EffectComposer multisampling={0}>
        {/* Anti-aliasing */}
        <SMAA />

        {/* Ambient Occlusion for added depth,
        This effect is too heavy for the scene, so I'm disabling it for now,

         */}
        {/* <SSAO
          blendFunction={BlendFunction.MULTIPLY}
          samples={31}
          radius={0.5}
          intensity={30}
          luminanceInfluence={0.5}
          bias={0.5}
          worldDistanceThreshold={0.5}
          worldDistanceFalloff={0.5}
          worldProximityThreshold={0.5}
          worldProximityFalloff={0.5}
        /> */}

        {/* Subtle bloom for fabric highlights */}
        <Bloom
          intensity={0.5}
          luminanceThreshold={0.9}
          luminanceSmoothing={0.025}
          height={300}
        />

        {/* Color correction */}
        <BrightnessContrast
          brightness={0.02} // Subtle brightness boost
          contrast={0.05} // Slight contrast enhancement
        />
      </EffectComposer>
    </Canvas>
  )
}

function Scene() {
  // Create a ref for the camera controls
  // So I can access the camera controls from the TShirtModel component to update the camera position
  const cameraControlsRef = useRef<CameraControls>(null)
  const [controls, setControls] = useState<CameraControls | null>(null)

  // Only set the controls once they're initialized
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
      Added a smooth time and damping factor for smoother camera movement
    */}
      <CameraControls
        ref={cameraControlsRef}
        makeDefault
        smoothTime={0.2}
        // Disable zoom functionality
        dollySpeed={0}
      />

      <TShirtModel cameraControls={controls} />
    </>
  )
}
