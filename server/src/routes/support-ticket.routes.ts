import { Router } from 'express'
import {
  addReply,
  createTicket,
  getTicket,
  listTickets,
  updateTicketStatus,
} from '../controllers/support-ticket.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'
import { requireRole } from '../middleware/role.middleware.js'

const supportRouter = Router()

supportRouter.use(authenticate)

supportRouter.post('/', requireRole('USER'), createTicket)
supportRouter.get('/', listTickets)
supportRouter.get('/:id', getTicket)
supportRouter.post('/:id/replies', addReply)

supportRouter.patch(
  '/:id/status',
  requireRole('ADMIN'),
  updateTicketStatus,
)

export default supportRouter
