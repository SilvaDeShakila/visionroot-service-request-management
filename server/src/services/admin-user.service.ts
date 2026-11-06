
import * as userRepository from '../repositories/admin-user.repository.js'
import type { UserRole } from '../models/User.js'

export class AdminUserServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message)
    this.name = 'AdminUserServiceError'
  }
}

export async function listUsers() {
  return userRepository.findAllUsers()
}

export async function changeUserRole(
  targetUserId: string,
  currentAdminId: string,
  role: UserRole,
) {
  const targetUser = await userRepository.findUserById(targetUserId)

  if (!targetUser) {
    throw new AdminUserServiceError('User was not found.', 404)
  }

  if (targetUserId === currentAdminId && role !== 'ADMIN') {
    throw new AdminUserServiceError(
      'You cannot remove your own administrator role.',
      400,
    )
  }

  if (targetUser.role === 'ADMIN' && role !== 'ADMIN') {
    const adminCount = await userRepository.countAdmins()

    if (adminCount <= 1) {
      throw new AdminUserServiceError(
        'The last administrator role cannot be removed.',
        400,
      )
    }
  }

  const updatedUser = await userRepository.updateUserRole(
    targetUserId,
    role,
  )

  if (!updatedUser) {
    throw new AdminUserServiceError('User was not found.', 404)
  }

  return updatedUser
}
