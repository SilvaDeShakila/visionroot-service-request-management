import mongoose from 'mongoose'
import type { ErrorRequestHandler, RequestHandler } from 'express'
import { AuthServiceError } from '../services/auth.service.js'
import { ServiceRequestServiceError } from '../services/service-request.service.js'
import { SupportTicketServiceError } from '../services/support-ticket.service.js'
import { AdminUserServiceError } from '../services/admin-user.service.js'

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  })
}

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _req,
  res,
  _next,
) => {
  if (
    error instanceof AuthServiceError ||
    error instanceof ServiceRequestServiceError ||
    error instanceof SupportTicketServiceError ||
    error instanceof AdminUserServiceError
  ) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    })
    return
  }

  if (error instanceof mongoose.Error.ValidationError) {
    res.status(400).json({
      success: false,
      message: 'Database validation failed.',
      errors: Object.values(error.errors).map((issue) => issue.message),
    })
    return
  }

  if (error instanceof mongoose.Error.CastError) {
    res.status(400).json({
      success: false,
      message: 'Invalid resource identifier or data format.',
    })
    return
  }

  if (
    error !== null &&
    typeof error === 'object' &&
    'code' in error &&
    error.code === 11000
  ) {
    res.status(409).json({
      success: false,
      message: 'A record with the provided unique value already exists.',
    })
    return
  }

  console.error('Unhandled application error:', error)

  res.status(500).json({
    success: false,
    message: 'An unexpected server error occurred.',
  })
}
