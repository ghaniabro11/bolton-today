import { z } from "zod";

export const categorySchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),
  image: z.any().optional(),
  parentCategoryId: z.number().nullable().optional(),
});

export const updateCategorySchema = categorySchema.partial();
