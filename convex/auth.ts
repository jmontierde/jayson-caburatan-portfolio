import { v } from "convex/values";
import { mutation, query, MutationCtx, QueryCtx } from "./_generated/server";

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

export const login = mutation({
  args: { password: v.string() },
  handler: async (ctx, { password }) => {
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) {
      throw new Error(
        "ADMIN_PASSWORD is not configured. Run: npx convex env set ADMIN_PASSWORD <your-password>"
      );
    }
    if (password !== expected) {
      throw new Error("Invalid password");
    }
    const token = crypto.randomUUID();
    const now = Date.now();
    await ctx.db.insert("sessions", {
      token,
      createdAt: now,
      expiresAt: now + SESSION_TTL_MS,
    });
    return { token };
  },
});

export const verifySession = query({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", token))
      .first();
    if (!session) return { valid: false as const };
    if (session.expiresAt < Date.now()) return { valid: false as const };
    return { valid: true as const };
  },
});

export const logout = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", token))
      .first();
    if (session) await ctx.db.delete(session._id);
    return null;
  },
});

// Helper to assert a request carries a valid admin token. Throws otherwise.
export async function requireAdmin(
  ctx: MutationCtx | QueryCtx,
  token: string
) {
  const session = await ctx.db
    .query("sessions")
    .withIndex("by_token", (q) => q.eq("token", token))
    .first();
  if (!session || session.expiresAt < Date.now()) {
    throw new Error("Unauthorized");
  }
}
