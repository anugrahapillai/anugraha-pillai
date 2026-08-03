import { z } from "zod";

export const contentStatuses = ["draft", "published", "archived"];
export const deliveryStates = ["pending", "live", "failed"];
export const contentTypes = ["posts", "posters", "research", "services"];

export const slugSchema = z
  .string()
  .trim()
  .min(2, "Slug must contain at least 2 characters.")
  .max(120, "Slug must be 120 characters or fewer.")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and single hyphens.");

export const blogDraftSchema = z.object({
  title: z.string().trim().min(3).max(160),
  slug: slugSchema,
  excerpt: z.string().trim().min(10).max(320),
  body: z.string().trim().min(1),
  category: z.string().trim().min(1).max(60),
  tags: z.array(z.string().trim().min(1).max(40)).max(12),
  coverAlt: z.string().trim().max(180).optional().default(""),
  seoTitle: z.string().trim().max(60).optional().default(""),
  seoDescription: z.string().trim().max(160).optional().default(""),
});

export const contentDraftSchema = blogDraftSchema.extend({
  status: z.literal("draft").optional().default("draft"),
  media: z.object({
    displayPath: z.string().max(500),
    thumbnailPath: z.string().max(500),
    width: z.number().int().positive().max(12000),
    height: z.number().int().positive().max(12000),
    version: z.number().int().positive(),
  }).strict().nullable().optional().default(null),
}).strict();

export const publicationRequestSchema = z.object({
  contentType: z.enum(contentTypes),
  contentId: z.string().trim().min(1).max(128),
  expectedUpdatedAt: z.string().datetime(),
  idempotencyKey: z.string().uuid(),
}).strict();

export function normalizeSlug(value) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .replace(/-{2,}/g, "-");
}
