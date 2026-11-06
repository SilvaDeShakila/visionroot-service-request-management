import { Router } from 'express'
import { rateLimit } from 'express-rate-limit'
import {
  getCurrentUser,
  login,
  logout,
  register,
  updateProfile,
  updateAvatar,
  updateAvatarPreset,
} from '../controllers/auth.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'
import { avatarUpload } from '../middleware/avatar-upload.middleware.js'

const authRouter = Router()

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again in 15 minutes.',
  },
})

const registrationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many registration attempts. Please try again in 15 minutes.',
  },
})

authRouter.post('/register', registrationLimiter, register)
authRouter.post('/login', loginLimiter, login)
authRouter.post('/logout', authenticate, logout)
authRouter.get('/me', authenticate, getCurrentUser)
authRouter.put('/profile', authenticate, updateProfile)
authRouter.post('/avatar', authenticate, avatarUpload, updateAvatar)
authRouter.put('/avatar/preset', authenticate, updateAvatarPreset)

export default authRouter

