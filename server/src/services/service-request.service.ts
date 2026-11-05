import * as requestRepository from '../repositories/service-request.repository.js'
import type { IServiceRequestDocument, RequestStatus } from '../models/ServiceRequest.js'
import type { UserRole } from '../models/User.js'
import type {
  CreateServiceRequestInput,
  ServiceRequestQuery,
  UpdateServiceRequestInput,
} from '../validators/service-request.validator.js'

export class ServiceRequestServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message)
    this.name = 'ServiceRequestServiceError'
  }
}

const allowedTransitions: Record<RequestStatus, RequestStatus[]> = {
  PENDING: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['RESOLVED', 'CANCELLED'],
  RESOLVED: [],
  CANCELLED: [],
}

export async function createRequest(
  userId: string,
  input: CreateServiceRequestInput,
): Promise<IServiceRequestDocument> {
  return requestRepository.create(userId, input)
}

export async function listRequests(
  query: ServiceRequestQuery,
  userId: string,
  role: UserRole,
) {
  const result = await requestRepository.findMany(
    query,
    role === 'ADMIN' ? undefined : userId,
  )

  return {
    requests: result.requests,
    pagination: {
      page: query.page,
      limit: query.limit,
      total: result.total,
      totalPages: Math.ceil(result.total / query.limit),
    },
  }
}

export async function getRequest(
  requestId: string,
  userId: string,
  role: UserRole,
): Promise<IServiceRequestDocument> {
  const request = await requestRepository.findById(
    requestId,
    role === 'ADMIN' ? undefined : userId,
  )

  if (!request) {
    throw new ServiceRequestServiceError(
      'Service request was not found.',
      404,
    )
  }

  return request
}

export async function updateRequest(
  requestId: string,
  userId: string,
  role: UserRole,
  input: UpdateServiceRequestInput,
): Promise<IServiceRequestDocument> {
  const request = await getRequest(requestId, userId, role)

  if (role !== 'ADMIN' && request.status !== 'PENDING') {
    throw new ServiceRequestServiceError(
      'Only pending requests can be edited.',
      400,
    )
  }

  const updatedRequest = await requestRepository.update(requestId, input)

  if (!updatedRequest) {
    throw new ServiceRequestServiceError(
      'Service request was not found.',
      404,
    )
  }

  return updatedRequest
}

export async function changeRequestStatus(
  requestId: string,
  userId: string,
  role: UserRole,
  newStatus: RequestStatus,
): Promise<IServiceRequestDocument> {
  const request = await getRequest(requestId, userId, role)

  if (role === 'USER' && (newStatus !== 'CANCELLED' || request.status !== 'PENDING')) {
    throw new ServiceRequestServiceError(
      'Users can only cancel their own pending requests.',
      403,
    )
  }

  const allowedNextStatuses = allowedTransitions[request.status]

  if (!allowedNextStatuses.includes(newStatus)) {
    throw new ServiceRequestServiceError(
      `Cannot change request status from ${request.status} to ${newStatus}.`,
      400,
    )
  }

  const updatedRequest = await requestRepository.updateStatus(
    requestId,
    newStatus,
  )

  if (!updatedRequest) {
    throw new ServiceRequestServiceError(
      'Service request was not found.',
      404,
    )
  }

  return updatedRequest
}

export async function deleteRequest(
  requestId: string,
  userId: string,
  role: UserRole,
): Promise<void> {
  const request = await getRequest(requestId, userId, role)

  if (role !== 'ADMIN' && request.status !== 'PENDING') {
    throw new ServiceRequestServiceError(
      'Only pending requests can be deleted.',
      400,
    )
  }

  await requestRepository.deleteById(requestId)
}
