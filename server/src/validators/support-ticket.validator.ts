import { z } from 'zod'

export const createSupportTicketSchema = z.object({
  subject: z.string().trim().min(5).max(120),
  message: z.string().trim().min(10).max(3000),
  category: z.enum(['TECHNICAL', 'ACCOUNT', 'BILLING', 'GENERAL']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
})

export const supportTicketQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  status: z.enum([
    'OPEN',
    'IN_PROGRESS',
    'WAITING_FOR_USER',
    'RESOLVED',
    'CLOSED',
  ]).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
})

export const addSupportReplySchema = z.object({
  message: z.string().trim().min(1).max(3000),
})

export const updateSupportStatusSchema = z.object({
  status: z.enum([
    'OPEN',
    'IN_PROGRESS',
    'WAITING_FOR_USER',
    'RESOLVED',
    'CLOSED',
  ]),
})

export type CreateSupportTicketInput =
  z.infer<typeof createSupportTicketSchema>

export type SupportTicketQuery =
  z.infer<typeof supportTicketQuerySchema>

export type AddSupportReplyInput =
  z.infer<typeof addSupportReplySchema>
