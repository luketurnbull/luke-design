import { createFileRoute } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import { useQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { Id } from 'convex/_generated/dataModel'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls, useTexture } from '@react-three/drei'
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

function RouteComponent() {
  const params = Route.useParams()
  const { data: model } = useQuery(
    convexQuery(api.models.getById, {
      modelId: params.modelId as Id<'models'>,
    }),
  )

  if (!model) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin w-10 h-10" />
      </div>
    )
  }

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
      }}
    >
      <OrbitControls />
      <Scene />
    </Canvas>
  )
}

function Scene() {
  return (
    <>
      <Environment path="/environment-maps/field/" files="2k.hdr" />

      <TShirtModel />
    </>
  )
}
