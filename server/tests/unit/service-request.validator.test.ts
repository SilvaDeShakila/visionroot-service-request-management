import { describe, expect, it } from '@jest/globals'
import {
  createServiceRequestSchema,
  updateServiceRequestSchema,
  updateRequestStatusSchema,
  serviceRequestQuerySchema,
} from '../../src/validators/service-request.validator.js'

describe('Service request creation validation', () => {
  const validRequest = {
    title: 'Internet connection problem',
    description: 'I need assistance with my internet connection.',
    category: 'TECHNICAL_SUPPORT',
  }

  it('accepts valid service request data', () => {
    expect(createServiceRequestSchema.safeParse(validRequest).success).toBe(true)
  })

  it('sets MEDIUM as the default priority', () => {
    const result = createServiceRequestSchema.safeParse(validRequest)

    expect(result.success).toBe(true)

    if (result.success) {
      expect(result.data.priority).toBe('MEDIUM')
    }
  })

  it('rejects invalid categories', () => {
    expect(
      createServiceRequestSchema.safeParse({
        ...validRequest,
        category: 'INVALID',
      }).success,
    ).toBe(false)
  })

  it('rejects invalid priorities', () => {
    expect(
      createServiceRequestSchema.safeParse({
        ...validRequest,
        priority: 'URGENT',
      }).success,
    ).toBe(false)
  })
})

describe('Service request update validation', () => {
  it('rejects an empty update', () => {
    expect(updateServiceRequestSchema.safeParse({}).success).toBe(false)
  })

  it('accepts a valid title update', () => {
    expect(
      updateServiceRequestSchema.safeParse({
        title: 'Updated support request title',
      }).success,
    ).toBe(true)
  })
})

describe('Service request status validation', () => {
  it('accepts a valid status', () => {
    expect(
      updateRequestStatusSchema.safeParse({
        status: 'IN_PROGRESS',
      }).success,
    ).toBe(true)
  })

  it('rejects an invalid status', () => {
    expect(
      updateRequestStatusSchema.safeParse({
        status: 'INVALID_STATUS',
      }).success,
    ).toBe(false)
  })
})

describe('Service request query validation', () => {
  it('applies default pagination and sorting values', () => {
    const result = serviceRequestQuerySchema.safeParse({})

    expect(result.success).toBe(true)

    if (result.success) {
      expect(result.data.page).toBe(1)
      expect(result.data.limit).toBe(10)
      expect(result.data.sortBy).toBe('createdAt')
      expect(result.data.sortOrder).toBe('desc')
    }
  })

  it('rejects pagination limits above 100', () => {
    expect(
      serviceRequestQuerySchema.safeParse({
        limit: '500',
      }).success,
    ).toBe(false)
  })
})
