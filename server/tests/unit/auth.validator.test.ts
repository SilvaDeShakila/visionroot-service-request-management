import { describe, expect, it } from '@jest/globals'
import {
  registerSchema,
  loginSchema,
} from '../../src/validators/auth.validator.js'

describe('Registration validation', () => {
  const validRegistration = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'TestPass123',
    confirmPassword: 'TestPass123',
  }

  it('accepts valid registration data', () => {
    expect(registerSchema.safeParse(validRegistration).success).toBe(true)
  })

  it('rejects an invalid email address', () => {
    const result = registerSchema.safeParse({
      ...validRegistration,
      email: 'invalid-email',
    })

    expect(result.success).toBe(false)
  })

  it('rejects a weak password', () => {
    const result = registerSchema.safeParse({
      ...validRegistration,
      password: 'weak',
      confirmPassword: 'weak',
    })

    expect(result.success).toBe(false)
  })

  it('rejects mismatched passwords', () => {
    const result = registerSchema.safeParse({
      ...validRegistration,
      confirmPassword: 'DifferentPass123',
    })

    expect(result.success).toBe(false)
  })

  it('normalizes email addresses to lowercase', () => {
    const result = registerSchema.safeParse({
      ...validRegistration,
      email: 'TEST@EXAMPLE.COM',
    })

    expect(result.success).toBe(true)

    if (result.success) {
      expect(result.data.email).toBe('test@example.com')
    }
  })
})

describe('Login validation', () => {
  it('accepts valid login data', () => {
    expect(
      loginSchema.safeParse({
        email: 'test@example.com',
        password: 'TestPass123',
      }).success,
    ).toBe(true)
  })

  it('rejects missing passwords', () => {
    expect(
      loginSchema.safeParse({
        email: 'test@example.com',
        password: '',
      }).success,
    ).toBe(false)
  })
})
