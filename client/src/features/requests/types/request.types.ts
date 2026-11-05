export type RequestCategory =
  | 'TECHNICAL_SUPPORT'
  | 'BILLING'
  | 'ACCOUNT'
  | 'GENERAL'

export type RequestPriority = 'LOW' | 'MEDIUM' | 'HIGH'

export type RequestStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'CANCELLED'

export interface ServiceRequest {
  _id: string
  user: string
  title: string
  description: string
  category: RequestCategory
  priority: RequestPriority
  status: RequestStatus
  createdAt: string
  updatedAt: string
}

export interface RequestPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface RequestListResponse {
  success: boolean
  data: {
    requests: ServiceRequest[]
    pagination: RequestPagination
  }
}

export interface SingleRequestResponse {
  success: boolean
  message?: string
  data: {
    request: ServiceRequest
  }
}

export interface DeleteRequestResponse {
  success: boolean
  message: string
}

export interface RequestFilters {
  search?: string
  status?: RequestStatus
  category?: RequestCategory
  priority?: RequestPriority
  page?: number
  limit?: number
  sortBy?: 'createdAt' | 'updatedAt' | 'priority' | 'status'
  sortOrder?: 'asc' | 'desc'
}

export interface CreateRequestData {
  title: string
  description: string
  category: RequestCategory
  priority: RequestPriority
}

export type UpdateRequestData = Partial<CreateRequestData>
