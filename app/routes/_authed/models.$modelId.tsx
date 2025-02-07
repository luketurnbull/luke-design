import { createFileRoute } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import { useQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { Id } from 'convex/_generated/dataModel'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import { Loader2 } from 'lucide-react'
import TShirtModel from '~/components/TShirtModel'
import * as THREE from 'three'

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
        // Enable antialiasing for smoother edges
        antialias: true,
        // Apply Reinhard tone mapping for realistic lighting
        toneMapping: THREE.ReinhardToneMapping,
        // Enable tone mapping for realistic lighting
        toneMappingExposure: 3,

        // Enable soft shadows, not sure how to do this in react-three-fiber
        // TODO: Figure out how to do this in react-three-fiber
        // shadowMap: {
        //   type: THREE.PCFSoftShadowMap,
        // },
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

      <OrbitControls />

      <Scene />
    </Canvas>
  )
}

function Scene() {
  return (
    <>
      <TShirtModel />
    </>
  )
}
