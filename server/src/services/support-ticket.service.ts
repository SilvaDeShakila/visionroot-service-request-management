import * as supportRepository from '../repositories/support-ticket.repository.js'
import type {
  ISupportTicketDocument,
  SupportStatus,
} from '../models/SupportTicket.js'
import type { UserRole } from '../models/User.js'
import type {
  CreateSupportTicketInput,
  SupportTicketQuery,
} from '../validators/support-ticket.validator.js'

export class SupportTicketServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message)
    this.name = 'SupportTicketServiceError'
  }
}

export async function createTicket(
  userId: string,
  input: CreateSupportTicketInput,
): Promise<ISupportTicketDocument> {
  return supportRepository.create(userId, input)
}

export async function listTickets(
  query: SupportTicketQuery,
  userId: string,
  role: UserRole,
) {
  const result = await supportRepository.findMany(
    query,
    role === 'ADMIN' ? undefined : userId,
  )

  return {
    tickets: result.tickets,
    pagination: {
      page: query.page,
      limit: query.limit,
      total: result.total,
      totalPages: Math.ceil(result.total / query.limit),
    },
  }
}

export async function getTicket(
  ticketId: string,
  userId: string,
  role: UserRole,
) {
  const ticket = await supportRepository.findById(
    ticketId,
    role === 'ADMIN' ? undefined : userId,
  )

  if (!ticket) {
    throw new SupportTicketServiceError(
      'Support ticket was not found.',
      404,
    )
  }

  return ticket
}

export async function addReply(
  ticketId: string,
  userId: string,
  role: UserRole,
  message: string,
) {
  const ticket = await getTicket(ticketId, userId, role)

  if (ticket.status === 'CLOSED') {
    throw new SupportTicketServiceError(
      'This support ticket is closed.',
      400,
    )
  }

  const updatedTicket = await supportRepository.addReply(
    ticketId,
    userId,
    role,
    message,
  )

  if (!updatedTicket) {
    throw new SupportTicketServiceError(
      'Support ticket was not found.',
      404,
    )
  }

  return updatedTicket
}

export async function updateTicketStatus(
  ticketId: string,
  status: SupportStatus,
): Promise<ISupportTicketDocument> {
  const updatedTicket = await supportRepository.updateStatus(
    ticketId,
    status,
  )

  if (!updatedTicket) {
    throw new SupportTicketServiceError(
      'Support ticket was not found.',
      404,
    )
  }

  return updatedTicket
}
