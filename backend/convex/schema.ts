
import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  userProfiles: defineTable({
    tokenIdentifier: v.string(),
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    updatedAt: v.number(),
  }).index("by_tokenIdentifier", ["tokenIdentifier"]),

  opportunities: defineTable({
    labURL: v.string(),
    labName: v.string(),
    labDescription: v.string(),
    headFaculty: v.string(),
    opportunityType: v.optional(v.string()),
    researcherInformation: v.optional(v.string()),
    researchFocus: v.optional(v.string()),
    researchPositionTitle: v.optional(v.string()) 
  }),
})
