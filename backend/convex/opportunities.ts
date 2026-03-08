import { query } from "./_generated/server";
import type { QueryCtx } from "./_generated/server";

export const get_opportunities = query({
  args: {},
  handler: async (ctx: QueryCtx) => {
    const opportunities = await ctx.db.query("opportunities").collect();

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
