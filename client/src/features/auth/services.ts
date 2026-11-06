import apiClient from '../../lib/api-client'
import type { AuthResponse } from './types/auth.types'

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface LoginData {
  email: string
  password: string
}

export interface ProfileUpdateData {
  name: string
  email: string
}

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      '/auth/register',
      data,
    )
    return response.data
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      '/auth/login',
      data,
    )
    return response.data
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  },

  async getCurrentUser(): Promise<AuthResponse> {
    const response = await apiClient.get<AuthResponse>('/auth/me')
    return response.data
  },

  async uploadAvatar(file: File): Promise<AuthResponse> {
    const formData = new FormData()
    formData.append('avatar', file)

    const response = await apiClient.post<AuthResponse>(
      '/auth/avatar',
      formData,
    )

    return response.data
  },
  async selectAvatarPreset(preset: string): Promise<AuthResponse> {
    const response = await apiClient.put<AuthResponse>(
      '/auth/avatar/preset',
      { preset },
    )
    return response.data
  },
  async updateProfile(data: ProfileUpdateData): Promise<AuthResponse> {
    const response = await apiClient.put<AuthResponse>(
      '/auth/profile',
      data,
    )
    return response.data
  },
}
