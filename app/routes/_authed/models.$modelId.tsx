import { createFileRoute } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import { useQuery } from 'convex/react'
import { Id } from 'convex/_generated/dataModel'

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
  const model = useQuery(api.models.getById, {
    modelId: params.modelId as Id<'models'>,
  })

  return <div className="p-20">Hello {model?.name}</div>
}
