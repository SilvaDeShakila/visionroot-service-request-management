import mongoose, { Document, Model, Schema } from 'mongoose'

export type SupportCategory =
  | 'TECHNICAL'
  | 'ACCOUNT'
  | 'BILLING'
  | 'GENERAL'

export type SupportPriority = 'LOW' | 'MEDIUM' | 'HIGH'

export type SupportStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'WAITING_FOR_USER'
  | 'RESOLVED'
  | 'CLOSED'

export interface ISupportReply {
  sender: mongoose.Types.ObjectId
  senderRole: 'USER' | 'ADMIN'
  message: string
  createdAt: Date
}

export interface ISupportTicket {
  user: mongoose.Types.ObjectId
  subject: string
  message: string
  category: SupportCategory
  priority: SupportPriority
  status: SupportStatus
  replies: ISupportReply[]
  createdAt: Date
  updatedAt: Date
}

export interface ISupportTicketDocument
  extends ISupportTicket,
    Document {}

const supportReplySchema = new Schema<ISupportReply>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    senderRole: {
      type: String,
      enum: ['USER', 'ADMIN'],
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 3000,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true },
)

const supportTicketSchema = new Schema<ISupportTicketDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 120,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 3000,
    },
    category: {
      type: String,
      enum: ['TECHNICAL', 'ACCOUNT', 'BILLING', 'GENERAL'],
      required: true,
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'MEDIUM',
    },
    status: {
      type: String,
      enum: [
        'OPEN',
        'IN_PROGRESS',
        'WAITING_FOR_USER',
        'RESOLVED',
        'CLOSED',
      ],
      default: 'OPEN',
      index: true,
    },
    replies: {
      type: [supportReplySchema],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

supportTicketSchema.index({ user: 1, createdAt: -1 })
supportTicketSchema.index({ status: 1, priority: 1, createdAt: -1 })

const SupportTicket: Model<ISupportTicketDocument> =
  mongoose.models.SupportTicket ||
  mongoose.model<ISupportTicketDocument>(
    'SupportTicket',
    supportTicketSchema,
  )

export default SupportTicket
