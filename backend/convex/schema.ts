import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  userProfiles: defineTable({
    tokenIdentifier: v.string(),
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()), 
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_tokenIdentifier", ["tokenIdentifier"]),

  opportunities: defineTable({
    title: v.string(),
    labURL: v.string(),
    labName: v.string(),
    labDescription: v.string(),
    headFaculty: v.string(),
    opportunityType: v.string(),
    researcherInformation: v.string(),
    researchFocus: v.string(),
    postedAt: v.optional(v.number()),
  }),
})
