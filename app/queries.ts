import { convexQuery } from '@convex-dev/react-query'
import { api } from '../convex/_generated/api'
import { Id } from 'convex/_generated/dataModel'

export const modelQueries = {
  list: (userId: string) => convexQuery(api.models.getAllByUser, { userId }),
  detail: (modelId: Id<'models'>) =>
    convexQuery(api.models.getById, { modelId }),
}
