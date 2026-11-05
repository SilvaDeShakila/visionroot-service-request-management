import bcrypt from 'bcryptjs'
import type { RegisterInput, LoginInput } from '../validators/auth.validator.js'
import * as userRepository from '../repositories/user.repository.js'
import { generateAccessToken } from '../utils/auth.util.js'

export class AuthServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message)
    this.name = 'AuthServiceError'
  }
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN'
}

export interface AuthResult {
  user: AuthUser
  token: string
}

function toAuthUser(user: {
  _id: { toString(): string }
  name: string
  email: string
  role: 'USER' | 'ADMIN'
}): AuthUser {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  }
}

export async function register(input: RegisterInput): Promise<AuthResult> {
  const existingUser = await userRepository.findByEmail(input.email)

  if (existingUser) {
    throw new AuthServiceError(
      'An account with this email address already exists.',
      409,
    )
  }

  const passwordHash = await bcrypt.hash(input.password, 12)

  const user = await userRepository.createUser({
    name: input.name,
    email: input.email,
    password: passwordHash,
  })

  return {
    user: toAuthUser(user),
    token: generateAccessToken(
      user._id.toString(),
      user.tokenVersion,
    ),
  }
}

export async function login(input: LoginInput): Promise<AuthResult> {
  const user = await userRepository.findByEmail(input.email)

  if (!user) {
    throw new AuthServiceError('Invalid email or password.', 401)
  }

  const passwordMatches = await bcrypt.compare(
    input.password,
    user.password,
  )

  if (!passwordMatches) {
    throw new AuthServiceError('Invalid email or password.', 401)
  }

  return {
    user: toAuthUser(user),
    token: generateAccessToken(
      user._id.toString(),
      user.tokenVersion,
    ),
  }
}

export async function getCurrentUser(userId: string): Promise<AuthUser> {
  const user = await userRepository.findById(userId)

  if (!user) {
    throw new AuthServiceError('User account was not found.', 404)
  }

  return toAuthUser(user)
}

export async function revokeUserSessions(userId: string): Promise<void> {
  await userRepository.incrementTokenVersion(userId)
}
