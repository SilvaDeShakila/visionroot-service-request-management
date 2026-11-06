export type UserRole = 'USER' | 'ADMIN'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  avatar: string | null
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    user: AuthUser
  }
}

export interface ApiErrorResponse {
  success: false
  message: string
  errors?: string[]
}
