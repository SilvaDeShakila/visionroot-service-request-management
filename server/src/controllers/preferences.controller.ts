import type { NextFunction, Request, Response } from 'express'
import * as preferencesService from '../services/preferences.service.js'
import { updatePreferencesSchema } from '../validators/preferences.validator.js'

export async function getPreferences(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) throw new Error('Authenticated user context is missing.')

    const preferences = await preferencesService.getPreferences(req.user.id)

    res.status(200).json({
      success: true,
      data: { preferences },
    })
  } catch (error) {
    next(error)
  }
}

export async function updatePreferences(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) throw new Error('Authenticated user context is missing.')

    const validation = updatePreferencesSchema.safeParse(req.body)

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: 'Invalid preferences.',
        errors: validation.error.flatten().fieldErrors,
      })
      return
    }

    const preferences = await preferencesService.updatePreferences(
      req.user.id,
      validation.data,
    )

    res.status(200).json({
      success: true,
      message: 'Preferences saved successfully.',
      data: { preferences },
    })
  } catch (error) {
    next(error)
  }
}
