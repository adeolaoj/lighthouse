import { query } from "./_generated/server";
import type { QueryCtx } from "./_generated/server";

export const get_opportunities = query({
  args: {},
  handler: async (ctx: QueryCtx) => {
    try {
      const opportunities = await ctx.db.query("opportunities").collect();

      return opportunities.map((opportunity) => ({
        id: opportunity._id,
        title: opportunity.title,
        labURL: opportunity.labURL,
        labName: opportunity.labName,
        labDescription: opportunity.labDescription,
        headFaculty: opportunity.headFaculty,
        opportunityType: opportunity.opportunityType,
        researcherInformation: opportunity.researcherInformation,
        researchFocus: opportunity.researchFocus, 
        postedAt: opportunity._creationTime ?? null, 
      }));
    } catch (error) {
      throw new Error("Failed to fetch opportunities from the database.");
    }
  },
});