import { beforeEach, describe, expect, it, jest } from '@jest/globals'

jest.unstable_mockModule('../../src/repositories/support-ticket.repository.js', () => ({
  create: jest.fn(),
  findMany: jest.fn(),
  findById: jest.fn(),
  addReply: jest.fn(),
  updateStatus: jest.fn(),
}))

const repository = await import('../../src/repositories/support-ticket.repository.js')
const service = await import('../../src/services/support-ticket.service.js')

const mockTicket = (status: string) => ({
  _id: 'ticket-123',
  user: 'user-123',
  subject: 'Unable to access my account',
  message: 'I need help accessing my account.',
  category: 'ACCOUNT',
  priority: 'MEDIUM',
  status,
  replies: [],
  createdAt: new Date(),
  updatedAt: new Date(),
})

describe('Support ticket service business logic', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('limits USER ticket listing to their own tickets', async () => {
    jest.mocked(repository.findMany).mockResolvedValue({
      tickets: [],
      total: 0,
    })

    await service.listTickets(
      { page: 1, limit: 10 } as never,
      'user-123',
      'USER',
    )

    expect(repository.findMany).toHaveBeenCalledWith(
      expect.any(Object),
      'user-123',
    )
  })

  it('allows ADMIN to list tickets without an owner restriction', async () => {
    jest.mocked(repository.findMany).mockResolvedValue({
      tickets: [],
      total: 0,
    })

    await service.listTickets(
      { page: 1, limit: 10 } as never,
      'admin-123',
      'ADMIN',
    )

    expect(repository.findMany).toHaveBeenCalledWith(
      expect.any(Object),
      undefined,
    )
  })

  it('rejects USER access to another users ticket', async () => {
    jest.mocked(repository.findById).mockResolvedValue(null)

    await expect(
      service.getTicket('ticket-123', 'user-456', 'USER'),
    ).rejects.toMatchObject({ statusCode: 404 })

    expect(repository.findById).toHaveBeenCalledWith(
      'ticket-123',
      'user-456',
    )
  })

  it('rejects replies to closed tickets', async () => {
    jest.mocked(repository.findById).mockResolvedValue(
      mockTicket('CLOSED') as never,
    )

    await expect(
      service.addReply(
        'ticket-123',
        'user-123',
        'USER',
        'Thank you for the update.',
      ),
    ).rejects.toMatchObject({ statusCode: 400 })

    expect(repository.addReply).not.toHaveBeenCalled()
  })

  it('allows USER replies to open tickets', async () => {
    jest.mocked(repository.findById).mockResolvedValue(
      mockTicket('OPEN') as never,
    )
    jest.mocked(repository.addReply).mockResolvedValue(
      mockTicket('IN_PROGRESS') as never,
    )

    const result = await service.addReply(
      'ticket-123',
      'user-123',
      'USER',
      'Thank you for the update.',
    )

    expect(result.status).toBe('IN_PROGRESS')
    expect(repository.addReply).toHaveBeenCalledWith(
      'ticket-123',
      'user-123',
      'USER',
      'Thank you for the update.',
    )
  })

  it('allows ADMIN replies and returns WAITING_FOR_USER status', async () => {
    jest.mocked(repository.findById).mockResolvedValue(
      mockTicket('OPEN') as never,
    )
    jest.mocked(repository.addReply).mockResolvedValue(
      mockTicket('WAITING_FOR_USER') as never,
    )

    const result = await service.addReply(
      'ticket-123',
      'admin-123',
      'ADMIN',
      'We are reviewing your request.',
    )

    expect(result.status).toBe('WAITING_FOR_USER')
    expect(repository.addReply).toHaveBeenCalledWith(
      'ticket-123',
      'admin-123',
      'ADMIN',
      'We are reviewing your request.',
    )
  })

  it('returns 404 when a support ticket does not exist', async () => {
    jest.mocked(repository.findById).mockResolvedValue(null)

    await expect(
      service.getTicket('missing-ticket', 'admin-123', 'ADMIN'),
    ).rejects.toMatchObject({ statusCode: 404 })
  })
})
