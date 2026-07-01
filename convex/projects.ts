import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { requireAdmin } from "./auth";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("projects").collect();
    return items.sort((a, b) => a.sortOrder - b.sortOrder);
  },
});

export const create = mutation({
  args: {
    token: v.string(),
    title: v.string(),
    subTitle: v.string(),
    description: v.string(),
    img: v.string(),
    mobileImg: v.optional(v.string()),
    video: v.optional(v.string()),
    projectUrl: v.string(),
    techStack: v.array(v.string()),
    sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);
    const { token: _t, ...rest } = args;
    return await ctx.db.insert("projects", rest);
  },
});

export const update = mutation({
  args: {
    token: v.string(),
    id: v.id("projects"),
    title: v.string(),
    subTitle: v.string(),
    description: v.string(),
    img: v.string(),
    mobileImg: v.optional(v.string()),
    video: v.optional(v.string()),
    projectUrl: v.string(),
    techStack: v.array(v.string()),
    sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx, args.token);
    const { token: _t, id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

export const remove = mutation({
  args: { token: v.string(), id: v.id("projects") },
  handler: async (ctx, { token, id }) => {
    await requireAdmin(ctx, token);
    await ctx.db.delete(id);
  },
});
