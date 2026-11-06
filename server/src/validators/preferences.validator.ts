import { z } from 'zod'

export const updatePreferencesSchema = z.object({
  theme: z.enum(['light', 'dark']).optional(),
  density: z.enum(['comfortable', 'compact']).optional(),
  emailNotifications: z.boolean().optional(),
  requestUpdates: z.boolean().optional(),
  productAnnouncements: z.boolean().optional(),
  reduceMotion: z.boolean().optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  'At least one preference must be provided.',
)

export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>
