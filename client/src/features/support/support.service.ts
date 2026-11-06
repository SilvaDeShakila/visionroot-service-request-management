import apiClient from '../../lib/api-client'
import type {
  CreateSupportTicketData,
  SingleSupportTicketResponse,
  SupportTicketFilters,
  SupportTicketListResponse,
  SupportStatus,
} from './support.types'

export const supportService = {
  async getAll(
    filters: SupportTicketFilters = {},
  ): Promise<SupportTicketListResponse> {
    const response = await apiClient.get<SupportTicketListResponse>(
      '/support',
      { params: filters },
    )
    return response.data
  },

  async getById(id: string): Promise<SingleSupportTicketResponse> {
    const response = await apiClient.get<SingleSupportTicketResponse>(
      `/support/${id}`,
    )
    return response.data
  },

  async create(
    data: CreateSupportTicketData,
  ): Promise<SingleSupportTicketResponse> {
    const response = await apiClient.post<SingleSupportTicketResponse>(
      '/support',
      data,
    )
    return response.data
  },

  async addReply(
    id: string,
    message: string,
  ): Promise<SingleSupportTicketResponse> {
    const response = await apiClient.post<SingleSupportTicketResponse>(
      `/support/${id}/replies`,
      { message },
    )
    return response.data
  },

  async updateStatus(
    id: string,
    status: SupportStatus,
  ): Promise<SingleSupportTicketResponse> {
    const response = await apiClient.patch<SingleSupportTicketResponse>(
      `/support/${id}/status`,
      { status },
    )
    return response.data
  },
}
