import { createFileRoute } from '@tanstack/react-router'
import { api } from 'convex/_generated/api'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { Id } from 'convex/_generated/dataModel'
import { modelQueries } from '~/queries'
import { Loader2 } from 'lucide-react'

/**
 * This route is used to display a specific t-shirt model.
 * It is wrapped in the _authed route so only authenticated users can access it.
 * It uses the modelId from the URL to fetch the model from the database.
 * In the future this could be used for sharing models with other users and allowing them to edit them.
 */
export const Route = createFileRoute('/_authed/models/$modelId')({
  component: RouteComponent,
  pendingComponent: () => (
    <div className="flex items-center justify-center">
      <Loader2 className="animate-spin w-10 h-10" />
    </div>
  ),
  errorComponent: () => <div>Error, no model found.</div>,
  loader: async ({ params, context: { queryClient } }) => {
    await queryClient.ensureQueryData(
      modelQueries.detail(params.modelId as Id<'models'>),
    )
  },
})

function RouteComponent() {
  const params = Route.useParams()
  const model = useSuspenseQuery(
    convexQuery(api.models.getById, {
      modelId: params.modelId as Id<'models'>,
    }),
  )

  return <div className="p-2">Hello {model?.data?.name}</div>
}
