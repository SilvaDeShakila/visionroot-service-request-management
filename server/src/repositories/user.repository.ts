import User, { type IUserDocument } from '../models/User.js'

export async function findByEmail(
  email: string,
): Promise<IUserDocument | null> {
  return User.findOne({ email }).select('+password +tokenVersion')
}

export async function findById(
  userId: string,
): Promise<IUserDocument | null> {
  return User.findById(userId).select('-password +tokenVersion')
}

export async function createUser(data: {
  name: string
  email: string
  password: string
}): Promise<IUserDocument> {
  return User.create({
    name: data.name,
    email: data.email,
    password: data.password,
  })
}

export async function incrementTokenVersion(userId: string): Promise<void> {
  await User.updateOne(
    { _id: userId },
    { $inc: { tokenVersion: 1 } },
  )
}
