import { Router } from 'express'
import { getPreferences, updatePreferences } from '../controllers/preferences.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'

const preferencesRouter = Router()

preferencesRouter.use(authenticate)
preferencesRouter.get('/', getPreferences)
preferencesRouter.patch('/', updatePreferences)

export default preferencesRouter
