import { createFileRoute } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import { useQuery } from 'convex/react'
import { Id } from 'convex/_generated/dataModel'

export const Route = createFileRoute('/_authed/models/$modelId')({
  component: RouteComponent,
})

function RouteComponent() {
  const params = Route.useParams()
  const model = useQuery(api.models.getById, {
    modelId: params.modelId as Id<'models'>,
  })

  return <div className="p-20">Hello {model?.name}</div>
}
