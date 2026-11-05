import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { requestService } from '../services'
import type {
  CreateRequestData,
  RequestFilters,
  RequestStatus,
  UpdateRequestData,
} from '../types/request.types'

export const requestKeys = {
  all: ['service-requests'] as const,
  lists: () => [...requestKeys.all, 'list'] as const,
  list: (filters: RequestFilters) => [...requestKeys.lists(), filters] as const,
  details: () => [...requestKeys.all, 'detail'] as const,
  detail: (id: string) => [...requestKeys.details(), id] as const,
}

export function useRequests(filters: RequestFilters = {}) {
  return useQuery({
    queryKey: requestKeys.list(filters),
    queryFn: () => requestService.getAll(filters),
  })
}

export function useRequest(id: string) {
  return useQuery({
    queryKey: requestKeys.detail(id),
    queryFn: () => requestService.getById(id),
    enabled: Boolean(id),
  })
}

export function useCreateRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateRequestData) => requestService.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: requestKeys.all })
    },
  })
}

export function useUpdateRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRequestData }) =>
      requestService.update(id, data),
    onSuccess: (_response, variables) => {
      void queryClient.invalidateQueries({ queryKey: requestKeys.all })
      void queryClient.invalidateQueries({
        queryKey: requestKeys.detail(variables.id),
      })
    },
  })
}

export function useUpdateRequestStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: RequestStatus }) =>
      requestService.updateStatus(id, status),
    onSuccess: (_response, variables) => {
      void queryClient.invalidateQueries({ queryKey: requestKeys.all })
      void queryClient.invalidateQueries({
        queryKey: requestKeys.detail(variables.id),
      })
    },
  })
}

export function useDeleteRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => requestService.delete(id),
    onSuccess: (_response, id) => {
      void queryClient.invalidateQueries({ queryKey: requestKeys.all })
      queryClient.removeQueries({ queryKey: requestKeys.detail(id) })
    },
  })
}
