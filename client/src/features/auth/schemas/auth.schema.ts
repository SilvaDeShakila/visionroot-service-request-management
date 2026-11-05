import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
})

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must contain at least 2 characters.').max(80),
  email: z.string().trim().email('Enter a valid email address.'),
  password: z.string()
    .min(8, 'Password must contain at least 8 characters.')
    .max(128)
    .regex(/[a-z]/, 'Include at least one lowercase letter.')
    .regex(/[A-Z]/, 'Include at least one uppercase letter.')
    .regex(/[0-9]/, 'Include at least one number.'),
  confirmPassword: z.string(),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  },
)

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
