import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAdmin } from "./auth";

const SINGLETON_KEY = "main";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("header")
      .withIndex("by_key", (q) => q.eq("key", SINGLETON_KEY))
      .first();
  },
});

export const upsert = mutation({
  args: {
    token: v.string(),
    imageUrl: v.string(),
    availability: v.string(),
    location: v.string(),
    bioBold: v.string(),
    bioRest: v.string(),
    techTags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);
    const { token: _t, ...rest } = args;
    const existing = await ctx.db
      .query("header")
      .withIndex("by_key", (q) => q.eq("key", SINGLETON_KEY))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, rest);
    } else {
      await ctx.db.insert("header", { key: SINGLETON_KEY, ...rest });
    }
  },
});
