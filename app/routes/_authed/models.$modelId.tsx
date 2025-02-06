import { createFileRoute } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import { useQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { Id } from 'convex/_generated/dataModel'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { OrbitControls } from '@react-three/drei'
import { Loader2 } from 'lucide-react'
import * as THREE from 'three'
import TShirtModel from '~/components/TShirtModel'

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

  console.log(model)

  if (!model) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="animate-spin w-10 h-10" />
      </div>
    )
  }

  return (
    <Canvas>
      <OrbitControls />
      <Scene />
    </Canvas>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      <TShirtModel />
    </>
  )
}
