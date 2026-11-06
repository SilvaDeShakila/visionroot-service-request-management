import mongoose from 'mongoose'
import SupportTicket, {
  type ISupportTicketDocument,
  type SupportPriority,
  type SupportStatus,
} from '../models/SupportTicket.js'
import type {
  CreateSupportTicketInput,
  SupportTicketQuery,
} from '../validators/support-ticket.validator.js'

export async function create(
  userId: string,
  input: CreateSupportTicketInput,
): Promise<ISupportTicketDocument> {
  return SupportTicket.create({
    user: new mongoose.Types.ObjectId(userId),
    ...input,
  })
}

export async function findMany(
  query: SupportTicketQuery,
  userId?: string,
) {
  const filter: Record<string, unknown> = {}

  if (userId) {
    filter.user = new mongoose.Types.ObjectId(userId)
  }

  if (query.status) {
    filter.status = query.status
  }

  const skip = (query.page - 1) * query.limit

  const [tickets, total] = await Promise.all([
    SupportTicket.find(filter)
      .populate('user', 'name email')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(query.limit),
    SupportTicket.countDocuments(filter),
  ])

  return { tickets, total }
}

export async function findById(
  ticketId: string,
  userId?: string,
): Promise<ISupportTicketDocument | null> {
  if (!mongoose.isValidObjectId(ticketId)) return null

  const filter: Record<string, unknown> = { _id: ticketId }

  if (userId) {
    filter.user = new mongoose.Types.ObjectId(userId)
  }

  return SupportTicket.findOne(filter)
    .populate('user', 'name email')
    .populate('replies.sender', 'name email')
}

export async function addReply(
  ticketId: string,
  senderId: string,
  senderRole: 'USER' | 'ADMIN',
  message: string,
): Promise<ISupportTicketDocument | null> {
  return SupportTicket.findByIdAndUpdate(
    ticketId,
    {
      $push: {
        replies: {
          sender: new mongoose.Types.ObjectId(senderId),
          senderRole,
          message,
          createdAt: new Date(),
        },
      },
      $set: {
        status: senderRole === 'ADMIN' ? 'WAITING_FOR_USER' : 'IN_PROGRESS',
      },
    },
    { new: true, runValidators: true },
  )
    .populate('user', 'name email')
    .populate('replies.sender', 'name email')
}

export async function updateStatus(
  ticketId: string,
  status: SupportStatus,
): Promise<ISupportTicketDocument | null> {
  return SupportTicket.findByIdAndUpdate(
    ticketId,
    { status },
    { new: true, runValidators: true },
  )
    .populate('user', 'name email')
    .populate('replies.sender', 'name email')
}

