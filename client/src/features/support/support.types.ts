export type SupportCategory =
  | 'TECHNICAL'
  | 'ACCOUNT'
  | 'BILLING'
  | 'GENERAL'

export type SupportPriority = 'LOW' | 'MEDIUM' | 'HIGH'

export type SupportStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'WAITING_FOR_USER'
  | 'RESOLVED'
  | 'CLOSED'

export interface SupportReply {
  _id: string
  sender: {
    _id: string
    name: string
    email: string
  }
  senderRole: 'USER' | 'ADMIN'
  message: string
  createdAt: string
}

export interface SupportTicket {
  _id: string
  user: {
    _id: string
    name: string
    email: string
  }
  subject: string
  message: string
  category: SupportCategory
  priority: SupportPriority
  status: SupportStatus
  replies: SupportReply[]
  createdAt: string
  updatedAt: string
}

export interface CreateSupportTicketData {
  subject: string
  message: string
  category: SupportCategory
  priority: SupportPriority
}

export interface SupportTicketFilters {
  page?: number
  limit?: number
  status?: SupportStatus
  priority?: SupportPriority
}

export interface SupportTicketListResponse {
  success: boolean
  data: {
    tickets: SupportTicket[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

export interface SingleSupportTicketResponse {
  success: boolean
  message?: string
  data: {
    ticket: SupportTicket
  }
}


