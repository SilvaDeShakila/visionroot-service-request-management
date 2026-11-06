import User, { defaultUserPreferences, type IUserPreferences } from '../models/User.js'
import type { UpdatePreferencesInput } from '../validators/preferences.validator.js'

export async function getPreferences(userId: string): Promise<IUserPreferences> {
  const user = await User.findById(userId).select('preferences')

  if (!user) {
    throw new Error('User account was not found.')
  }

  return {
    ...defaultUserPreferences,
    ...(user.preferences ?? {}),
  }
}

export async function updatePreferences(
  userId: string,
  updates: UpdatePreferencesInput,
): Promise<IUserPreferences> {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: Object.fromEntries(
        Object.entries(updates).map(([key, value]) => [
          `preferences.${key}`,
          value,
        ]),
      ),
    },
    { new: true, runValidators: true },
  ).select('preferences')

  if (!user) {
    throw new Error('User account was not found.')
  }

  return {
    ...defaultUserPreferences,
    ...(user.preferences ?? {}),
  }
}

