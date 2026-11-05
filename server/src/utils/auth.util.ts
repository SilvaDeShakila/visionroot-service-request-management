import jwt, { type SignOptions } from 'jsonwebtoken'
import { env } from '../config/env.js'

export interface AccessTokenPayload {
  userId: string
  tokenVersion: number
}

export function generateAccessToken(
  userId: string,
  tokenVersion: number,
): string {
  return jwt.sign(
    { sub: userId, tokenVersion },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
    },
  )
}

export function verifyAccessToken(token: string): AccessTokenPayload | null {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET)

    if (
      typeof payload === 'string' ||
      typeof payload.sub !== 'string' ||
      typeof payload.tokenVersion !== 'number' ||
      !Number.isInteger(payload.tokenVersion) ||
      payload.tokenVersion < 0
    ) {
      return null
    }

    return {
      userId: payload.sub,
      tokenVersion: payload.tokenVersion,
    }
  } catch {
    return null
  }
}
