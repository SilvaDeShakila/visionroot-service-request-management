import type { NextFunction, Request, Response } from 'express'
import { env } from '../config/env.js'
import * as authService from '../services/auth.service.js'
import {
  loginSchema,
  registerSchema,
} from '../validators/auth.validator.js'

const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 24 * 60 * 60 * 1000,
}

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const validation = registerSchema.safeParse(req.body)

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: validation.error.flatten().fieldErrors,
      })
      return
    }

    const result = await authService.register(validation.data)

    res.cookie(env.COOKIE_NAME, result.token, cookieOptions)

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      data: { user: result.user },
    })
  } catch (error) {
    next(error)
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const validation = loginSchema.safeParse(req.body)

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: validation.error.flatten().fieldErrors,
      })
      return
    }

    const result = await authService.login(validation.data)

    res.cookie(env.COOKIE_NAME, result.token, cookieOptions)

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      data: { user: result.user },
    })
  } catch (error) {
    next(error)
  }
}

export async function logout(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication is required.',
      })
      return
    }

    await authService.revokeUserSessions(req.user.id)

    res.clearCookie(env.COOKIE_NAME, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })

    res.status(200).json({
      success: true,
      message: 'Logged out successfully. All existing sessions have been revoked.',
    })
  } catch (error) {
    next(error)
  }
}

export async function getCurrentUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication is required.',
      })
      return
    }

    const user = await authService.getCurrentUser(req.user.id)

    res.status(200).json({
      success: true,
      data: { user },
    })
  } catch (error) {
    next(error)
  }
}
