import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { supportService } from '../support.service'
import type {
  CreateSupportTicketData,
  SupportStatus,
  SupportTicketFilters,
} from '../support.types'

export const supportKeys = {
  all: ['support-tickets'] as const,
  lists: () => [...supportKeys.all, 'list'] as const,
  list: (filters: SupportTicketFilters) =>
    [...supportKeys.lists(), filters] as const,
  details: () => [...supportKeys.all, 'detail'] as const,
  detail: (id: string) => [...supportKeys.details(), id] as const,
}

export function useSupportTickets(filters: SupportTicketFilters = {}) {
  return useQuery({
    queryKey: supportKeys.list(filters),
    queryFn: () => supportService.getAll(filters),
  })
}

export function useSupportTicket(id: string) {
  return useQuery({
    queryKey: supportKeys.detail(id),
    queryFn: () => supportService.getById(id),
    enabled: Boolean(id),
  })
}

export function useCreateSupportTicket() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateSupportTicketData) =>
      supportService.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: supportKeys.all,
      })
    },
  })
}

export function useAddSupportReply() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      message,
    }: {
      id: string
      message: string
    }) => supportService.addReply(id, message),
    onSuccess: (_response, variables) => {
      void queryClient.invalidateQueries({
        queryKey: supportKeys.all,
      })
      void queryClient.invalidateQueries({
        queryKey: supportKeys.detail(variables.id),
      })
    },
  })
}

export function useUpdateSupportStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string
      status: SupportStatus
    }) => supportService.updateStatus(id, status),
    onSuccess: (_response, variables) => {
      void queryClient.invalidateQueries({
        queryKey: supportKeys.all,
      })
      void queryClient.invalidateQueries({
        queryKey: supportKeys.detail(variables.id),
      })
    },
  })
}
