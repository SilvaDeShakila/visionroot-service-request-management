import mongoose from 'mongoose'
import { env } from './env.js'

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI)

    console.info('MongoDB connection established successfully.')
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    process.exit(1)
  }
}
