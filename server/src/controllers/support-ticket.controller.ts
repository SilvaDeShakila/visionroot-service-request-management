import type { NextFunction, Request, Response } from 'express'
import * as supportService from '../services/support-ticket.service.js'
import {
  createSupportTicketSchema,
  supportTicketQuerySchema,
  addSupportReplySchema,
  updateSupportStatusSchema,
} from '../validators/support-ticket.validator.js'
import type { SupportStatus } from '../models/SupportTicket.js'

function getAuthenticatedUser(req: Request) {
  if (!req.user) {
    throw new Error('Authenticated user context is missing.')
  }

  return req.user
}

export async function createTicket(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = getAuthenticatedUser(req)
    const validation = createSupportTicketSchema.safeParse(req.body)

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: validation.error.flatten().fieldErrors,
      })
      return
    }

    const ticket = await supportService.createTicket(
      user.id,
      validation.data,
    )

    res.status(201).json({
      success: true,
      message: 'Support ticket created successfully.',
      data: { ticket },
    })
  } catch (error) {
    next(error)
  }
}

export async function listTickets(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = getAuthenticatedUser(req)
    const validation = supportTicketQuerySchema.safeParse(req.query)

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: 'Invalid query parameters.',
        errors: validation.error.flatten().fieldErrors,
      })
      return
    }

    const result = await supportService.listTickets(
      validation.data,
      user.id,
      user.role,
    )

    res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export async function getTicket(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = getAuthenticatedUser(req)

    const ticket = await supportService.getTicket(
      req.params.id as string,
      user.id,
      user.role,
    )

    res.status(200).json({
      success: true,
      data: { ticket },
    })
  } catch (error) {
    next(error)
  }
}

export async function addReply(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = getAuthenticatedUser(req)
    const validation = addSupportReplySchema.safeParse(req.body)

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: validation.error.flatten().fieldErrors,
      })
      return
    }

    const ticket = await supportService.addReply(
      req.params.id as string,
      user.id,
      user.role,
      validation.data.message,
    )

    res.status(200).json({
      success: true,
      message: 'Reply added successfully.',
      data: { ticket },
    })
  } catch (error) {
    next(error)
  }
}

export async function updateTicketStatus(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const validation = updateSupportStatusSchema.safeParse(req.body)

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: validation.error.flatten().fieldErrors,
      })
      return
    }

    const ticket = await supportService.updateTicketStatus(
      req.params.id as string,
      validation.data.status as SupportStatus,
    )

    res.status(200).json({
      success: true,
      message: 'Support ticket status updated successfully.',
      data: { ticket },
    })
  } catch (error) {
    next(error)
  }
}
