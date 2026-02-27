import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  opportunities: defineTable({
    title: v.string(),
    lab: v.string(),
    description: v.string(),
    url: v.string(),
    postedAt: v.optional(v.number()),
  }),
})
