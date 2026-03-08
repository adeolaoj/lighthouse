import { query, mutation } from "./_generated/server";
import type { QueryCtx } from "./_generated/server";
import { v } from "convex/values";

export const get_opportunities = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx: QueryCtx, args) => {
    const q = ctx.db.query("opportunities");
    const opportunities = (args.limit !== undefined)
      ? await q.take(args.limit)
      : await q.collect();

    return opportunities.map((opportunity) => ({
      id: opportunity._id,
      labURL: opportunity.labURL,
      labName: opportunity.labName,
      labDescription: opportunity.labDescription,
      headFaculty: opportunity.headFaculty,
      researchFocus: opportunity.researchFocus,
      researchPositionTitle: opportunity.researchPositionTitle,
      postedAt: opportunity._creationTime,
    }));
  },
});

// One-time seed mutation called by backend/scripts/seed-from-sqlite.ts
export const seed_opportunities = mutation({
  args: {
    opportunities: v.array(
      v.object({
        labURL: v.string(),
        labName: v.string(),
        labDescription: v.string(),
        headFaculty: v.string(),
        researchFocus: v.optional(v.string()),
        researchPositionTitle: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const opp of args.opportunities) {
      await ctx.db.insert("opportunities", opp);
    }
    return { inserted: args.opportunities.length };
  },
});
