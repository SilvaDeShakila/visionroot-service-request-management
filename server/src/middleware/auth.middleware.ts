import mongoose from 'mongoose'
import type { NextFunction, Request, Response } from 'express'
import * as userRepository from '../repositories/user.repository.js'
import { env } from '../config/env.js'
import { verifyAccessToken } from '../utils/auth.util.js'

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const token = req.cookies?.[env.COOKIE_NAME]

    if (typeof token !== 'string' || token.length === 0) {
      res.status(401).json({
        success: false,
        message: 'Authentication is required.',
      })
      return
    }

    const payload = verifyAccessToken(token)

    if (!payload || !mongoose.isValidObjectId(payload.userId)) {
      res.status(401).json({
        success: false,
        message: 'Your session is invalid or has expired. Please log in again.',
      })
      return
    }

    const user = await userRepository.findById(payload.userId)

    if (!user || user.tokenVersion !== payload.tokenVersion) {
      res.status(401).json({
        success: false,
        message: 'Your session is invalid or has expired. Please log in again.',
      })
      return
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    }

    next()
  } catch (error) {
    next(error)
  }
}
