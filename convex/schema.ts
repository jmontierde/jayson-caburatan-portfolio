import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Singleton: hero/header content. Keyed by `key: "main"`.
  header: defineTable({
    key: v.string(),
    imageUrl: v.string(),
    availability: v.string(),
    location: v.string(),
    bioBold: v.string(),
    bioRest: v.string(),
    techTags: v.array(v.string()),
  }).index("by_key", ["key"]),

  socials: defineTable({
    icon: v.string(), // "github" | "linkedin" | "mail"
    href: v.string(),
    label: v.string(),
    sortOrder: v.number(),
  }),

  // Top-of-page flowing menu items
  flowingMenu: defineTable({
    text: v.string(),
    image: v.string(),
    link: v.string(),
    sortOrder: v.number(),
  }),

  techStack: defineTable({
    name: v.string(),
    img: v.string(),
    sortOrder: v.number(),
  }),

  services: defineTable({
    title: v.string(),
    description: v.string(),
    sortOrder: v.number(),
  }),

  experience: defineTable({
    role: v.string(),
    company: v.string(),
    location: v.string(),
    dateRange: v.string(),
    tags: v.array(v.string()),
    bullets: v.array(v.string()),
    sortOrder: v.number(),
  }),

  // Singleton: education main card
  education: defineTable({
    key: v.string(),
    degree: v.string(),
    school: v.string(),
    location: v.string(),
    honors: v.array(v.string()),
  }).index("by_key", ["key"]),

  recognitions: defineTable({
    title: v.string(),
    description: v.string(),
    year: v.string(),
    sortOrder: v.number(),
  }),

  projects: defineTable({
    title: v.string(),
    subTitle: v.string(),
    description: v.string(),
    img: v.string(),
    mobileImg: v.optional(v.string()),
    video: v.optional(v.string()),
    projectUrl: v.string(),
    techStack: v.array(v.string()),
    sortOrder: v.number(),
  }),

  // Admin sessions issued after successful password login
  sessions: defineTable({
    token: v.string(),
    createdAt: v.number(),
    expiresAt: v.number(),
  }).index("by_token", ["token"]),
});
