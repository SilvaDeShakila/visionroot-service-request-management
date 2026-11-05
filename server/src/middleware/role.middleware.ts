import type { NextFunction, Request, Response } from 'express'
import type { UserRole } from '../models/User.js'

export function requireRole(...allowedRoles: UserRole[]) {
  return (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication is required.',
      })
      return
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'You do not have permission to access this resource.',
      })
      return
    }

    next()
  }
}
