import apiClient from '../../lib/api-client'
import type {
  CreateRequestData,
  DeleteRequestResponse,
  RequestFilters,
  RequestListResponse,
  SingleRequestResponse,
  UpdateRequestData,
  RequestStatus,
} from './types/request.types'

export const requestService = {
  async getAll(filters: RequestFilters = {}): Promise<RequestListResponse> {
    const response = await apiClient.get<RequestListResponse>('/requests', {
      params: filters,
    })
    return response.data
  },

  async getById(id: string): Promise<SingleRequestResponse> {
    const response = await apiClient.get<SingleRequestResponse>(`/requests/${id}`)
    return response.data
  },

  async create(data: CreateRequestData): Promise<SingleRequestResponse> {
    const response = await apiClient.post<SingleRequestResponse>('/requests', data)
    return response.data
  },

  async update(id: string, data: UpdateRequestData): Promise<SingleRequestResponse> {
    const response = await apiClient.patch<SingleRequestResponse>(`/requests/${id}`, data)
    return response.data
  },

  async updateStatus(id: string, status: RequestStatus): Promise<SingleRequestResponse> {
    const response = await apiClient.patch<SingleRequestResponse>(
      `/requests/${id}/status`,
      { status },
    )
    return response.data
  },

  async delete(id: string): Promise<DeleteRequestResponse> {
    const response = await apiClient.delete<DeleteRequestResponse>(`/requests/${id}`)
    return response.data
  },
}
