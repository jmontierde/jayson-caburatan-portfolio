import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./auth";

export const generateUploadUrl = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    await requireAdmin(ctx, token);
    return await ctx.storage.generateUploadUrl();
  },
});

export const getUrl = query({
  args: { storageId: v.string() },
  handler: async (ctx, { storageId }) => {
    return await ctx.storage.getUrl(storageId);
  },
});

export const getUrlFromAdmin = mutation({
  args: { token: v.string(), storageId: v.string() },
  handler: async (ctx, { token, storageId }) => {
    await requireAdmin(ctx, token);
    return await ctx.storage.getUrl(storageId);
  },
});
