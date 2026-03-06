import { mutation, query } from "./_generated/server";

export const getMe = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    return {
      identity,  // name/email/pictureUrl/tokenIdentifier
      profile,   // your app-owned doc (or null if not created yet)
    };
  },
});

export const syncMe = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const now = Date.now();

    const existing = await ctx.db
      .query("userProfiles")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    const data = {
      tokenIdentifier: identity.tokenIdentifier,
      name: identity.name ?? "",
      email: identity.email ?? "",
      image: identity.pictureUrl ?? "",
      updatedAt: now,
    };

    if (!existing) {
      return await ctx.db.insert("userProfiles", {
        ...data,
        createdAt: now,
      });
    }

    await ctx.db.patch(existing._id, data);
    return existing._id;
  },
});