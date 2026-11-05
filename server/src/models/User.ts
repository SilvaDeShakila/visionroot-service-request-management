import mongoose, { Document, Model, Schema } from 'mongoose'

export type UserRole = 'USER' | 'ADMIN'

export interface IUser {
  name: string
  email: string
  password: string
  role: UserRole
  tokenVersion: number
  createdAt: Date
  updatedAt: Date
}

export interface IUserDocument extends IUser, Document {}

const userSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must contain at least 2 characters'],
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [254, 'Email cannot exceed 254 characters'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
      required: true,
    },
    tokenVersion: {
      type: Number,
      default: 0,
      min: 0,
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

const User: Model<IUserDocument> =
  mongoose.models.User ||
  mongoose.model<IUserDocument>('User', userSchema)

export default User
