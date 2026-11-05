import { Router } from 'express'
import {
  changeRequestStatus,
  createRequest,
  deleteRequest,
  getRequest,
  listRequests,
  updateRequest,
} from '../controllers/service-request.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'
import { requireRole } from '../middleware/role.middleware.js'

const serviceRequestRouter = Router()

serviceRequestRouter.use(authenticate)

serviceRequestRouter.post('/', createRequest)
serviceRequestRouter.get('/', listRequests)
serviceRequestRouter.get('/:id', getRequest)
serviceRequestRouter.patch('/:id', updateRequest)
serviceRequestRouter.patch('/:id/status', changeRequestStatus)
serviceRequestRouter.delete('/:id', deleteRequest)

export default serviceRequestRouter
