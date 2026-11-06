import { beforeEach, describe, expect, it, jest } from '@jest/globals'

jest.unstable_mockModule('../../src/repositories/admin-user.repository.js', () => ({
  findAllUsers: jest.fn(),
  findUserById: jest.fn(),
  countAdmins: jest.fn(),
  updateUserRole: jest.fn(),
}))

const repository = await import('../../src/repositories/admin-user.repository.js')
const service = await import('../../src/services/admin-user.service.js')

const mockUser = (role: 'USER' | 'ADMIN') => ({
  _id: 'user-123',
  name: 'Test User',
  email: 'test@example.com',
  role,
})

describe('Admin user service business logic', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns the list of users', async () => {
    const users = [mockUser('USER'), mockUser('ADMIN')]
    jest.mocked(repository.findAllUsers).mockResolvedValue(users as never)

    const result = await service.listUsers()

    expect(result).toEqual(users)
    expect(repository.findAllUsers).toHaveBeenCalledTimes(1)
  })

  it('returns 404 when the target user does not exist', async () => {
    jest.mocked(repository.findUserById).mockResolvedValue(null)

    await expect(
      service.changeUserRole('missing-user', 'admin-123', 'ADMIN'),
    ).rejects.toMatchObject({ statusCode: 404 })

    expect(repository.updateUserRole).not.toHaveBeenCalled()
  })

  it('prevents an administrator from removing their own role', async () => {
    jest.mocked(repository.findUserById).mockResolvedValue(
      mockUser('ADMIN') as never,
    )

    await expect(
      service.changeUserRole('admin-123', 'admin-123', 'USER'),
    ).rejects.toMatchObject({ statusCode: 400 })

    expect(repository.updateUserRole).not.toHaveBeenCalled()
  })

  it('prevents removal of the last administrator role', async () => {
    jest.mocked(repository.findUserById).mockResolvedValue(
      mockUser('ADMIN') as never,
    )
    jest.mocked(repository.countAdmins).mockResolvedValue(1)

    await expect(
      service.changeUserRole('admin-456', 'admin-123', 'USER'),
    ).rejects.toMatchObject({ statusCode: 400 })

    expect(repository.updateUserRole).not.toHaveBeenCalled()
  })

  it('allows an administrator to be demoted when another administrator exists', async () => {
    const updatedUser = mockUser('USER')
    jest.mocked(repository.findUserById).mockResolvedValue(
      mockUser('ADMIN') as never,
    )
    jest.mocked(repository.countAdmins).mockResolvedValue(2)
    jest.mocked(repository.updateUserRole).mockResolvedValue(
      updatedUser as never,
    )

    const result = await service.changeUserRole(
      'admin-456',
      'admin-123',
      'USER',
    )

    expect(result).toEqual(updatedUser)
    expect(repository.updateUserRole).toHaveBeenCalledWith(
      'admin-456',
      'USER',
    )
  })

  it('allows a user to be promoted to administrator', async () => {
    const updatedUser = mockUser('ADMIN')
    jest.mocked(repository.findUserById).mockResolvedValue(
      mockUser('USER') as never,
    )
    jest.mocked(repository.updateUserRole).mockResolvedValue(
      updatedUser as never,
    )

    const result = await service.changeUserRole(
      'user-123',
      'admin-123',
      'ADMIN',
    )

    expect(result).toEqual(updatedUser)
    expect(repository.countAdmins).not.toHaveBeenCalled()
    expect(repository.updateUserRole).toHaveBeenCalledWith(
      'user-123',
      'ADMIN',
    )
  })

  it('returns 404 if the user disappears before the role update completes', async () => {
    jest.mocked(repository.findUserById).mockResolvedValue(
      mockUser('USER') as never,
    )
    jest.mocked(repository.updateUserRole).mockResolvedValue(null)

    await expect(
      service.changeUserRole('user-123', 'admin-123', 'ADMIN'),
    ).rejects.toMatchObject({ statusCode: 404 })
  })

  it('allows keeping an existing administrator role unchanged', async () => {
    const admin = mockUser('ADMIN')
    jest.mocked(repository.findUserById).mockResolvedValue(admin as never)
    jest.mocked(repository.updateUserRole).mockResolvedValue(admin as never)

    const result = await service.changeUserRole(
      'admin-456',
      'admin-123',
      'ADMIN',
    )

    expect(result).toEqual(admin)
    expect(repository.countAdmins).not.toHaveBeenCalled()
    expect(repository.updateUserRole).toHaveBeenCalledWith(
      'admin-456',
      'ADMIN',
    )
  })
})
