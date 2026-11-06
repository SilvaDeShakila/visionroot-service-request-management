import mongoose, { Document, Model, Schema } from 'mongoose'

export type UserRole = 'USER' | 'ADMIN'

export interface IUserPreferences {
  theme: 'light' | 'dark'
  density: 'comfortable' | 'compact'
  emailNotifications: boolean
  requestUpdates: boolean
  productAnnouncements: boolean
  reduceMotion: boolean
}

export const defaultUserPreferences: IUserPreferences = {
  theme: 'light',
  density: 'comfortable',
  emailNotifications: true,
  requestUpdates: true,
  productAnnouncements: false,
  reduceMotion: false,
}

export interface IUser {
  name: string
  email: string
  password: string
  role: UserRole
  avatar: string | null
  preferences: IUserPreferences
  tokenVersion: number
  createdAt: Date
  updatedAt: Date
}

export interface IUserDocument extends IUser, Document {}

const userPreferencesSchema = new Schema<IUserPreferences>(
  {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light',
    },
    density: {
      type: String,
      enum: ['comfortable', 'compact'],
      default: 'comfortable',
    },
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    requestUpdates: {
      type: Boolean,
      default: true,
    },
    productAnnouncements: {
      type: Boolean,
      default: false,
    },
    reduceMotion: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
)

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
    avatar: {
      type: String,
      default: null,
      maxlength: [500, 'Avatar path is too long'],
    },
    preferences: {
      type: userPreferencesSchema,
      default: () => ({}),
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
