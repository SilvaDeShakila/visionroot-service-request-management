import { z } from 'zod'

export const createRequestSchema = z.object({
  title: z.string()
    .trim()
    .min(5, 'Title must contain at least 5 characters.')
    .max(120, 'Title cannot exceed 120 characters.'),

  description: z.string()
    .trim()
    .min(10, 'Description must contain at least 10 characters.')
    .max(2000, 'Description cannot exceed 2000 characters.'),

  category: z.enum([
    'TECHNICAL_SUPPORT',
    'BILLING',
    'ACCOUNT',
    'GENERAL',
  ]),

  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
})

export type CreateRequestFormValues = z.infer<typeof createRequestSchema>
