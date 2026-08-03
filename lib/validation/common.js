import { z } from "zod";
export { contactSchema } from "./contact.js";

export const documentIdSchema = z.string().trim().min(1).max(128).regex(/^[A-Za-z0-9_-]+$/);
export const shortTextSchema = z.string().trim().max(160);
export const optionalUrlSchema = z.union([z.literal(""), z.url().max(2048)]).optional().default("");

export const auditFieldsSchema = z.object({
  createdAt: z.unknown(),
  createdBy: z.string().min(1).max(128),
  updatedAt: z.unknown(),
  updatedBy: z.string().min(1).max(128),
});

export function stripUndefined(value) {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined));
}
