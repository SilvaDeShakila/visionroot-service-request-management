import { z } from 'zod'

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must contain at least 2 characters')
      .max(80, 'Name cannot exceed 80 characters'),

    email: z
      .string()
      .trim()
      .email('Please provide a valid email address')
      .max(254, 'Email cannot exceed 254 characters')
      .transform((value) => value.toLowerCase()),

    password: z
      .string()
      .min(8, 'Password must contain at least 8 characters')
      .max(128, 'Password cannot exceed 128 characters')
      .regex(/[a-z]/, 'Password must contain a lowercase letter')
      .regex(/[A-Z]/, 'Password must contain an uppercase letter')
      .regex(/[0-9]/, 'Password must contain a number'),

    confirmPassword: z.string(),
  })
  .strict()
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const loginSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email('Please provide a valid email address')
      .max(254, 'Email cannot exceed 254 characters')
      .transform((value) => value.toLowerCase()),

    password: z
      .string()
      .min(1, 'Password is required')
      .max(128, 'Password cannot exceed 128 characters'),
  })
  .strict()

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
