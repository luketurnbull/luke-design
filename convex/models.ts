import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const profile = query((ctx) => ctx.auth.getUserIdentity())

export const getAllByUser = query(
  async (ctx, { userId }: { userId: string }) => {
    return await ctx.db
      .query('models')
      .filter((q) => q.eq(q.field('userId'), userId))
      .collect()
  },
)

export const getById = query({
  args: {
    modelId: v.id('models'),
  },
  handler: async (ctx, { modelId }) => {
    return await ctx.db.get(modelId)
  },
})

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, { name }) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error('User not authenticated')
    }

    const model = {
      name,
      userId: identity.subject,
      material: null,
    }
    return await ctx.db.insert('models', model)
  },
})

export const updateMaterial = mutation({
  args: {
    modelId: v.id('models'),
    material: v.union(v.string(), v.null()),
  },
  handler: async (ctx, { modelId, material }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('User not authenticated')
    }

    const model = await ctx.db.get(modelId)
    if (!model) {
      throw new Error('Model not found')
    }

    if (model.userId !== identity.subject) {
      throw new Error('Not authorized')
    }

    return await ctx.db.patch(modelId, { material })
  },
})
