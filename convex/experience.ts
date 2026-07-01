import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAdmin } from "./auth";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("experience").collect();
    return items.sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

export const create = mutation({
  args: {
    token: v.string(),
    role: v.string(),
    company: v.string(),
    location: v.string(),
    dateRange: v.string(),
    tags: v.array(v.string()),
    bullets: v.array(v.string()),
    sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);
    const { token: _t, ...rest } = args;
    return await ctx.db.insert("experience", rest);
  },
});

export const update = mutation({
  args: {
    token: v.string(),
    id: v.id("experience"),
    role: v.string(),
    company: v.string(),
    location: v.string(),
    dateRange: v.string(),
    tags: v.array(v.string()),
    bullets: v.array(v.string()),
    sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);
    const { token: _t, id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

export const remove = mutation({
  args: { token: v.string(), id: v.id("experience") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token);
    await ctx.db.delete(id);
  },
});
