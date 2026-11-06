import type { NextFunction, Request, Response } from 'express'
import { env } from '../config/env.js'
import * as authService from '../services/auth.service.js'
import {
  loginSchema,
  registerSchema,
  profileUpdateSchema,
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

export async function updateProfile(
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

    const validation = profileUpdateSchema.safeParse(req.body)

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: validation.error.flatten().fieldErrors,
      })
      return
    }

    const input = validation.data

    const user = await authService.updateCurrentUserProfile(
      req.user.id,
      input,
    )

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: { user },
    })
  } catch (error) {
    next(error)
  }
}



export async function updateAvatar(
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

    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'Please upload a JPG, PNG, or WEBP image (maximum 2 MB).',
      })
      return
    }

    const avatar = `/uploads/avatars/${req.file.filename}`

    const user = await authService.updateCurrentUserAvatar(
      req.user.id,
      avatar,
    )

    res.status(200).json({
      success: true,
      message: 'Profile picture updated successfully.',
      data: { user },
    })
  } catch (error) {
    next(error)
  }
}

const allowedAvatarPresets = [
  'avatar-blue',
  'avatar-purple',
  'avatar-green',
  'avatar-orange',
] as const

export async function updateAvatarPreset(
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

    const { preset } = req.body as { preset?: unknown }

    if (
      typeof preset !== 'string' ||
      !allowedAvatarPresets.includes(
        preset as (typeof allowedAvatarPresets)[number],
      )
    ) {
      res.status(400).json({
        success: false,
        message: 'Please select a valid avatar.',
      })
      return
    }

    const user = await authService.updateCurrentUserAvatar(
      req.user.id,
      `preset:${preset}`,
    )

    res.status(200).json({
      success: true,
      message: 'Avatar updated successfully.',
      data: { user },
    })
  } catch (error) {
    next(error)
  }
}