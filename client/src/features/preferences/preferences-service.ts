import apiClient from '../../lib/api-client'
import type { Preferences } from './preferences-context'

interface PreferencesResponse {
  success: boolean
  data: {
    preferences: Preferences
  }
}

export const preferencesService = {
  async getPreferences(): Promise<Preferences> {
    const response =
      await apiClient.get<PreferencesResponse>('/preferences')

    return response.data.data.preferences
  },

  async updatePreferences(
    updates: Partial<Preferences>,
  ): Promise<Preferences> {
    const response = await apiClient.patch<PreferencesResponse>(
      '/preferences',
      updates,
    )

    return response.data.data.preferences
  },
}
