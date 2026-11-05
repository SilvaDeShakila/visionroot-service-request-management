import type { QueryFilter } from 'mongoose'
import ServiceRequest, {
  type IServiceRequestDocument,
} from '../models/ServiceRequest.js'
import type {
  CreateServiceRequestInput,
  ServiceRequestQuery,
  UpdateServiceRequestInput,
} from '../validators/service-request.validator.js'

interface RequestListResult {
  requests: IServiceRequestDocument[]
  total: number
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export async function create(
  userId: string,
  data: CreateServiceRequestInput,
): Promise<IServiceRequestDocument> {
  return ServiceRequest.create({
    ...data,
    user: userId,
  })
}

export async function findById(
  requestId: string,
  userId?: string,
): Promise<IServiceRequestDocument | null> {
  const filter: QueryFilter<IServiceRequestDocument> = {
    _id: requestId,
  }

  if (userId) {
    filter.user = userId
  }

  return ServiceRequest.findOne(filter)
}

export async function findMany(
  query: ServiceRequestQuery,
  userId?: string,
): Promise<RequestListResult> {
  const filter: QueryFilter<IServiceRequestDocument> = {}

  if (userId) {
    filter.user = userId
  }

  if (query.status) {
    filter.status = query.status
  }

  if (query.category) {
    filter.category = query.category
  }

  if (query.priority) {
    filter.priority = query.priority
  }

  if (query.search) {
    const searchPattern = new RegExp(escapeRegex(query.search), 'i')

    filter.$or = [
      { title: searchPattern },
      { description: searchPattern },
    ]
  }

  const skip = (query.page - 1) * query.limit
  const sortDirection = query.sortOrder === 'asc' ? 1 : -1

  const [requests, total] = await Promise.all([
    ServiceRequest.find(filter)
      .sort({ [query.sortBy]: sortDirection })
      .skip(skip)
      .limit(query.limit),
    ServiceRequest.countDocuments(filter),
  ])

  return { requests, total }
}

export async function update(
  requestId: string,
  data: UpdateServiceRequestInput,
): Promise<IServiceRequestDocument | null> {
  return ServiceRequest.findByIdAndUpdate(
    requestId,
    { $set: data },
    { new: true, runValidators: true },
  )
}

export async function updateStatus(
  requestId: string,
  status: IServiceRequestDocument['status'],
): Promise<IServiceRequestDocument | null> {
  return ServiceRequest.findByIdAndUpdate(
    requestId,
    { $set: { status } },
    { new: true, runValidators: true },
  )
}

export async function deleteById(
  requestId: string,
): Promise<IServiceRequestDocument | null> {
  return ServiceRequest.findByIdAndDelete(requestId)
}
