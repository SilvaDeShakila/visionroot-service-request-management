import { z } from 'zod'

const categories = [
  'TECHNICAL_SUPPORT',
  'BILLING',
  'ACCOUNT',
  'GENERAL',
] as const

const priorities = ['LOW', 'MEDIUM', 'HIGH'] as const

const statuses = [
  'PENDING',
  'IN_PROGRESS',
  'RESOLVED',
  'CANCELLED',
] as const

export const createServiceRequestSchema = z
  .object({
    title: z.string().trim().min(5).max(120),
    description: z.string().trim().min(10).max(2000),
    category: z.enum(categories),
    priority: z.enum(priorities).default('MEDIUM'),
  })
  .strict()

export const updateServiceRequestSchema = z
  .object({
    title: z.string().trim().min(5).max(120).optional(),
    description: z.string().trim().min(10).max(2000).optional(),
    category: z.enum(categories).optional(),
    priority: z.enum(priorities).optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for an update.',
  })

export const updateRequestStatusSchema = z
  .object({
    status: z.enum(statuses),
  })
  .strict()

export const serviceRequestQuerySchema = z
  .object({
    search: z.string().trim().max(100).optional(),
    status: z.enum(statuses).optional(),
    category: z.enum(categories).optional(),
    priority: z.enum(priorities).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    sortBy: z.enum(['createdAt', 'updatedAt', 'priority', 'status']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  })
  .strict()

export type CreateServiceRequestInput = z.infer<typeof createServiceRequestSchema>
export type UpdateServiceRequestInput = z.infer<typeof updateServiceRequestSchema>
export type UpdateRequestStatusInput = z.infer<typeof updateRequestStatusSchema>
export type ServiceRequestQuery = z.infer<typeof serviceRequestQuerySchema>
