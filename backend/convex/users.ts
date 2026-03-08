import { mutation, query } from "./_generated/server";
import {v} from 'convex/values'

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

export const isAuthenticated = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    return identity !== null;
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
        ...data
      });
    }

    await ctx.db.patch(existing._id, data);
    return existing._id;
  },
});

export const emailExists = query({
  args: {email: v.string() },
  handler: async (ctx, { email }) => {
    const user = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('email'), email))
      .first()
    return user != null
  },
})