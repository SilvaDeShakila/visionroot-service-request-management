import mongoose, { Document, Model, Schema } from 'mongoose'

export type RequestPriority = 'LOW' | 'MEDIUM' | 'HIGH'

export type RequestStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'CANCELLED'

export type RequestCategory =
  | 'TECHNICAL_SUPPORT'
  | 'BILLING'
  | 'ACCOUNT'
  | 'GENERAL'

export interface IServiceRequest {
  user: mongoose.Types.ObjectId
  title: string
  description: string
  category: RequestCategory
  priority: RequestPriority
  status: RequestStatus
  createdAt: Date
  updatedAt: Date
}

export interface IServiceRequestDocument
  extends IServiceRequest,
    Document {}

const serviceRequestSchema = new Schema<IServiceRequestDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Request owner is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Request title is required'],
      trim: true,
      minlength: [5, 'Title must contain at least 5 characters'],
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Request description is required'],
      trim: true,
      minlength: [10, 'Description must contain at least 10 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      enum: [
        'TECHNICAL_SUPPORT',
        'BILLING',
        'ACCOUNT',
        'GENERAL',
      ],
      required: [true, 'Request category is required'],
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'MEDIUM',
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CANCELLED'],
      default: 'PENDING',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

serviceRequestSchema.index({ user: 1, createdAt: -1 })
serviceRequestSchema.index({ status: 1, createdAt: -1 })

const ServiceRequest: Model<IServiceRequestDocument> =
  mongoose.models.ServiceRequest ||
  mongoose.model<IServiceRequestDocument>(
    'ServiceRequest',
    serviceRequestSchema,
  )

export default ServiceRequest
