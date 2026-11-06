
import User, { type IUserDocument } from '../models/User.js'
import type { UserRole } from '../models/User.js'

export async function findAllUsers() {
  return User.find()
    .select('name email role createdAt avatar')
    .sort({ createdAt: -1 })
    .lean()
}

export async function findUserById(
  userId: string,
): Promise<IUserDocument | null> {
  return User.findById(userId).select('-password +tokenVersion')
}

export async function countAdmins(): Promise<number> {
  return User.countDocuments({ role: 'ADMIN' })
}

export async function updateUserRole(
  userId: string,
  role: UserRole,
): Promise<IUserDocument | null> {
  return User.findByIdAndUpdate(
    userId,
    { $set: { role } },
    { new: true, runValidators: true },
  ).select('-password -tokenVersion')
}
