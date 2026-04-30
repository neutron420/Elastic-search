import { z } from 'zod';

export const createPaperSchema = z.object({
  title: z.string().min(3),
  abstract: z.string().min(10),
  authors: z.array(z.string()).nonempty(),
  publishedDate: z.string().datetime(),
  category: z.string(),
  keywords: z.array(z.string()),
  citationsCount: z.number().int().nonnegative(),
  price: z.preprocess((val) => Number(val), z.number().nonnegative()).default(0),
  language: z.string().length(2),
  journal: z.string(),
  doi: z.string(),
});

export const updatePaperSchema = createPaperSchema.partial();

export const searchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  minCitations: z.preprocess((val) => Number(val), z.number().int().nonnegative()).optional(),
  minPrice: z.preprocess((val) => Number(val), z.number().nonnegative()).optional(),
  maxPrice: z.preprocess((val) => Number(val), z.number().nonnegative()).optional(),
  language: z.string().length(2).optional(),
  sortBy: z.enum(['relevance', 'date', 'citations', 'price']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.preprocess((val) => Number(val), z.number().int().positive()).optional(),
  limit: z.preprocess((val) => Number(val), z.number().int().positive()).optional(),
});
