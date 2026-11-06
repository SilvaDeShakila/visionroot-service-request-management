
import type { NextFunction, Request, Response } from 'express'
import * as adminUserService from '../services/admin-user.service.js'
import { updateUserRoleSchema } from '../validators/admin-user.validator.js'

export async function listUsers(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const users = await adminUserService.listUsers()

    res.status(200).json({
      success: true,
      data: { users },
    })
  } catch (error) {
    next(error)
  }
}

export async function updateUserRole(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required.',
      })
      return
    }

    const validation = updateUserRoleSchema.safeParse(req.body)

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: validation.error.flatten().fieldErrors,
      })
      return
    }

    const user = await adminUserService.changeUserRole(
      req.params.id as string,
      req.user.id,
      validation.data.role,
    )

    res.status(200).json({
      success: true,
      message: 'User role updated successfully.',
      data: { user },
    })
  } catch (error) {
    next(error)
  }
}
