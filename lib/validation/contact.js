import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().trim().email("Please provide a valid email address"),
  subject: z.string().trim().max(150, "Subject is too long").optional().default(""),
  message: z.string().trim().min(5, "Message must be at least 5 characters").max(2000, "Message is too long"),
  hp: z.string().optional().default(""),
});
