
import { Router } from 'express'
import {
  listUsers,
  updateUserRole,
} from '../controllers/admin-user.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'
import { requireRole } from '../middleware/role.middleware.js'

const adminUserRouter = Router()

adminUserRouter.use(authenticate, requireRole('ADMIN'))

adminUserRouter.get('/', listUsers)
adminUserRouter.patch('/:id/role', updateUserRole)

export default adminUserRouter
