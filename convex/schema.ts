import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  models: defineTable({
    userId: v.string(),
    name: v.string(),
    material: v.optional(v.union(v.string(), v.null())),
  }).index('userId', ['userId']),
})
