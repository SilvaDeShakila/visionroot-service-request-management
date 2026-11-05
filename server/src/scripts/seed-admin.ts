import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import { env } from '../config/env.js'
import User from '../models/User.js'

async function seedAdmin(): Promise<void> {
  const name = process.env.ADMIN_NAME
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD

  if (!name || !email || !password) {
    throw new Error(
      'ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD must be configured in the server .env file.',
    )
  }

  if (password.length < 12) {
    throw new Error('Admin password must contain at least 12 characters.')
  }

  await mongoose.connect(env.MONGODB_URI)

  const passwordHash = await bcrypt.hash(password, 12)
  const existingAdmin = await User.findOne({ email }).select('+tokenVersion')

  if (existingAdmin) {
    existingAdmin.name = name
    existingAdmin.password = passwordHash
    existingAdmin.role = 'ADMIN'
    existingAdmin.tokenVersion += 1
    await existingAdmin.save()
    console.info('Existing account has been updated as an administrator.')
  } else {
    await User.create({
      name,
      email,
      password: passwordHash,
      role: 'ADMIN',
    })
    console.info('Administrator account created successfully.')
  }
}

seedAdmin()
  .catch((error: unknown) => {
    console.error('Administrator setup failed:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await mongoose.disconnect()
  })
