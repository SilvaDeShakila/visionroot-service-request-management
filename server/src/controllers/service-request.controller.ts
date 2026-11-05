import type { NextFunction, Request, Response } from 'express'
import * as serviceRequestService from '../services/service-request.service.js'
import {
  createServiceRequestSchema,
  serviceRequestQuerySchema,
  updateRequestStatusSchema,
  updateServiceRequestSchema,
} from '../validators/service-request.validator.js'

function getAuthenticatedUser(req: Request) {
  if (!req.user) {
    throw new Error('Authenticated user context is missing.')
  }

  return req.user
}

export async function createRequest(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = getAuthenticatedUser(req)
    const validation = createServiceRequestSchema.safeParse(req.body)

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: validation.error.flatten().fieldErrors,
      })
      return
    }

    const request = await serviceRequestService.createRequest(
      user.id,
      validation.data,
    )

    res.status(201).json({
      success: true,
      message: 'Service request created successfully.',
      data: { request },
    })
  } catch (error) {
    next(error)
  }
}

export async function listRequests(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = getAuthenticatedUser(req)
    const validation = serviceRequestQuerySchema.safeParse(req.query)

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: 'Invalid query parameters.',
        errors: validation.error.flatten().fieldErrors,
      })
      return
    }

    const result = await serviceRequestService.listRequests(
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

export async function getRequest(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = getAuthenticatedUser(req)

    const request = await serviceRequestService.getRequest(
      req.params.id as string,
      user.id,
      user.role,
    )

    res.status(200).json({
      success: true,
      data: { request },
    })
  } catch (error) {
    next(error)
  }
}

export async function updateRequest(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = getAuthenticatedUser(req)
    const validation = updateServiceRequestSchema.safeParse(req.body)

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: validation.error.flatten().fieldErrors,
      })
      return
    }

    const request = await serviceRequestService.updateRequest(
      req.params.id as string,
      user.id,
      user.role,
      validation.data,
    )

    res.status(200).json({
      success: true,
      message: 'Service request updated successfully.',
      data: { request },
    })
  } catch (error) {
    next(error)
  }
}

export async function changeRequestStatus(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = getAuthenticatedUser(req)
    const validation = updateRequestStatusSchema.safeParse(req.body)

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: validation.error.flatten().fieldErrors,
      })
      return
    }

    const request = await serviceRequestService.changeRequestStatus(
      req.params.id as string,
      user.id,
      user.role,
      validation.data.status,
    )

    res.status(200).json({
      success: true,
      message: 'Service request status updated successfully.',
      data: { request },
    })
  } catch (error) {
    next(error)
  }
}

export async function deleteRequest(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = getAuthenticatedUser(req)

    await serviceRequestService.deleteRequest(
      req.params.id as string,
      user.id,
      user.role,
    )

    res.status(200).json({
      success: true,
      message: 'Service request deleted successfully.',
    })
  } catch (error) {
    next(error)
  }
}
