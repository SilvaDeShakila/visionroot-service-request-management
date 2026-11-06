import { beforeEach, describe, expect, it, jest } from '@jest/globals'

jest.unstable_mockModule('../../src/repositories/service-request.repository.js', () => ({
  create: jest.fn(),
  findMany: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  updateStatus: jest.fn(),
  deleteById: jest.fn(),
}))

const repository = await import('../../src/repositories/service-request.repository.js')
const service = await import('../../src/services/service-request.service.js')

const mockRequest = (status: string) => ({
  _id: 'request-123',
  user: 'user-123',
  title: 'Internet connection problem',
  description: 'I need help with my internet connection.',
  category: 'TECHNICAL_SUPPORT',
  priority: 'MEDIUM',
  status,
  createdAt: new Date(),
  updatedAt: new Date(),
})

describe('Service request business logic', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('limits USER request listing to their own requests', async () => {
    jest.mocked(repository.findMany).mockResolvedValue({
      requests: [],
      total: 0,
    })

    await service.listRequests(
      {
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      },
      'user-123',
      'USER',
    )

    expect(repository.findMany).toHaveBeenCalledWith(
      expect.any(Object),
      'user-123',
    )
  })

  it('allows ADMIN to list requests without an owner restriction', async () => {
    jest.mocked(repository.findMany).mockResolvedValue({
      requests: [],
      total: 0,
    })

    await service.listRequests(
      {
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      },
      'admin-123',
      'ADMIN',
    )

    expect(repository.findMany).toHaveBeenCalledWith(
      expect.any(Object),
      undefined,
    )
  })

  it('rejects editing a non-pending USER request', async () => {
    jest.mocked(repository.findById).mockResolvedValue(
      mockRequest('IN_PROGRESS') as never,
    )

    await expect(
      service.updateRequest(
        'request-123',
        'user-123',
        'USER',
        { title: 'Updated request title' },
      ),
    ).rejects.toMatchObject({ statusCode: 400 })

    expect(repository.update).not.toHaveBeenCalled()
  })

  it('rejects changing a resolved request back to in progress', async () => {
    jest.mocked(repository.findById).mockResolvedValue(
      mockRequest('RESOLVED') as never,
    )

    await expect(
      service.changeRequestStatus(
        'request-123',
        'admin-123',
        'ADMIN',
        'IN_PROGRESS',
      ),
    ).rejects.toMatchObject({ statusCode: 400 })

    expect(repository.updateStatus).not.toHaveBeenCalled()
  })

  it('rejects USER cancellation of an in-progress request', async () => {
    jest.mocked(repository.findById).mockResolvedValue(
      mockRequest('IN_PROGRESS') as never,
    )

    await expect(
      service.changeRequestStatus(
        'request-123',
        'user-123',
        'USER',
        'CANCELLED',
      ),
    ).rejects.toMatchObject({ statusCode: 403 })

    expect(repository.updateStatus).not.toHaveBeenCalled()
  })

  it('allows USER to cancel their own pending request', async () => {
    jest.mocked(repository.findById).mockResolvedValue(
      mockRequest('PENDING') as never,
    )
    jest.mocked(repository.updateStatus).mockResolvedValue(
      mockRequest('CANCELLED') as never,
    )

    const result = await service.changeRequestStatus(
      'request-123',
      'user-123',
      'USER',
      'CANCELLED',
    )

    expect(result.status).toBe('CANCELLED')
    expect(repository.updateStatus).toHaveBeenCalledWith(
      'request-123',
      'CANCELLED',
    )
  })

  it('returns 404 when a USER tries to access another users request', async () => {
    jest.mocked(repository.findById).mockResolvedValue(null)

    await expect(
      service.getRequest('request-123', 'user-123', 'USER'),
    ).rejects.toMatchObject({ statusCode: 404 })

    expect(repository.findById).toHaveBeenCalledWith('request-123', 'user-123')
  })

  it('allows a USER to edit their own pending request', async () => {
    jest.mocked(repository.findById).mockResolvedValue(mockRequest('PENDING') as never)
    jest.mocked(repository.update).mockResolvedValue(mockRequest('PENDING') as never)

    const result = await service.updateRequest(
      'request-123', 'user-123', 'USER',
      { title: 'Updated request title' },
    )

    expect(result.status).toBe('PENDING')
    expect(repository.update).toHaveBeenCalled()
  })

  it('allows ADMIN to move a pending request to in progress', async () => {
    jest.mocked(repository.findById).mockResolvedValue(mockRequest('PENDING') as never)
    jest.mocked(repository.updateStatus).mockResolvedValue(mockRequest('IN_PROGRESS') as never)

    const result = await service.changeRequestStatus(
      'request-123', 'admin-123', 'ADMIN', 'IN_PROGRESS',
    )

    expect(result.status).toBe('IN_PROGRESS')
    expect(repository.updateStatus).toHaveBeenCalledWith('request-123', 'IN_PROGRESS')
  })})

describe('Additional service request status transition tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('allows ADMIN to resolve an in-progress request', async () => {
    jest.mocked(repository.findById).mockResolvedValue(
      mockRequest('IN_PROGRESS') as never,
    )
    jest.mocked(repository.updateStatus).mockResolvedValue(
      mockRequest('RESOLVED') as never,
    )

    const result = await service.changeRequestStatus(
      'request-123', 'admin-123', 'ADMIN', 'RESOLVED',
    )

    expect(result.status).toBe('RESOLVED')
    expect(repository.updateStatus).toHaveBeenCalledWith(
      'request-123', 'RESOLVED',
    )
  })

  it('allows ADMIN to cancel an in-progress request', async () => {
    jest.mocked(repository.findById).mockResolvedValue(
      mockRequest('IN_PROGRESS') as never,
    )
    jest.mocked(repository.updateStatus).mockResolvedValue(
      mockRequest('CANCELLED') as never,
    )

    const result = await service.changeRequestStatus(
      'request-123', 'admin-123', 'ADMIN', 'CANCELLED',
    )

    expect(result.status).toBe('CANCELLED')
  })

  it('rejects changing a cancelled request back to pending', async () => {
    jest.mocked(repository.findById).mockResolvedValue(
      mockRequest('CANCELLED') as never,
    )

    await expect(
      service.changeRequestStatus(
        'request-123', 'admin-123', 'ADMIN', 'PENDING',
      ),
    ).rejects.toMatchObject({ statusCode: 400 })

    expect(repository.updateStatus).not.toHaveBeenCalled()
  })

  it('rejects changing a cancelled request to in progress', async () => {
    jest.mocked(repository.findById).mockResolvedValue(
      mockRequest('CANCELLED') as never,
    )

    await expect(
      service.changeRequestStatus(
        'request-123', 'admin-123', 'ADMIN', 'IN_PROGRESS',
      ),
    ).rejects.toMatchObject({ statusCode: 400 })

    expect(repository.updateStatus).not.toHaveBeenCalled()
  })

  it('returns 404 when the requested service request does not exist', async () => {
    jest.mocked(repository.findById).mockResolvedValue(null)

    await expect(
      service.getRequest('missing-request', 'admin-123', 'ADMIN'),
    ).rejects.toMatchObject({ statusCode: 404 })
  })
})
