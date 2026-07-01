import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAdmin } from "./auth";

const SINGLETON_KEY = "main";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("education")
      .withIndex("by_key", (q) => q.eq("key", SINGLETON_KEY))
      .first();
  },
});

export const upsert = mutation({
  args: {
    token: v.string(),
    degree: v.string(),
    school: v.string(),
    location: v.string(),
    honors: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);
    const { token: _t, ...rest } = args;
    const existing = await ctx.db
      .query("education")
      .withIndex("by_key", (q) => q.eq("key", SINGLETON_KEY))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, rest);
    } else {
      await ctx.db.insert("education", { key: SINGLETON_KEY, ...rest });
    }
  },
});
