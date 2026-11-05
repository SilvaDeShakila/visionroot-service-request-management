import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config({ quiet: true })

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGODB_URI: z.string().min(1, 'MongoDB connection URL is required'),
  CLIENT_URL: z.string().url(),
  JWT_SECRET: z.string().min(32, 'JWT secret must contain at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('1d'),
  COOKIE_NAME: z.string().min(1).default('visionroot_token'),
})

const result = environmentSchema.safeParse(process.env)

if (!result.success) {
  console.error('Invalid environment configuration:')

  for (const issue of result.error.issues) {
    console.error(`- ${issue.path.join('.')}: ${issue.message}`)
  }

  process.exit(1)
}

export const env = result.data
