import { describe, expect, it } from '@jest/globals'
import request from 'supertest'
import app from '../../src/app.js'

describe('Application integration tests', () => {
  it('returns a successful API health response', async () => {
    const response = await request(app)
      .get('/api/v1/health')
      .expect(200)

    expect(response.body.success).toBe(true)
    expect(response.body.message).toBe(
      'VisionRoot Service Request API is running.',
    )
    expect(response.body.timestamp).toBeDefined()
  })

  it('returns 404 for an unknown API route', async () => {
    const response = await request(app)
      .get('/api/v1/unknown-endpoint')
      .expect(404)

    expect(response.body.success).toBe(false)
    expect(response.body.message).toContain('Route not found')
  })

  it('rejects registration with invalid data', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'A',
        email: 'invalid-email',
        password: 'weak',
        confirmPassword: 'different',
      })
      .expect(400)

    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe('Validation failed.')
  })

  it('rejects login with invalid data', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'invalid-email',
        password: '',
      })
      .expect(400)

    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe('Validation failed.')
  })

  it('rejects unauthenticated access to the current user endpoint', async () => {
    const response = await request(app)
      .get('/api/v1/auth/me')
      .expect(401)

    expect(response.body.success).toBe(false)
  })

  it('rejects unauthenticated access to service requests', async () => {
    const response = await request(app)
      .get('/api/v1/requests')
      .expect(401)

    expect(response.body.success).toBe(false)
    expect(response.body.message).toBe('Authentication is required.')
  })

  it('rejects unauthenticated service request creation', async () => {
    const response = await request(app)
      .post('/api/v1/requests')
      .send({
        title: 'Internet connection problem',
        description: 'I need help with my internet connection.',
        category: 'TECHNICAL_SUPPORT',
      })
      .expect(401)

    expect(response.body.success).toBe(false)
  })
})
