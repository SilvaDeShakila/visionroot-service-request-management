import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { useAuth } from '../auth/auth-context'
import { preferencesService } from './preferences-service'

export type ThemeMode = 'light' | 'dark'
export type LayoutDensity = 'comfortable' | 'compact'

export interface Preferences {
  theme: ThemeMode
  density: LayoutDensity
  emailNotifications: boolean
  requestUpdates: boolean
  productAnnouncements: boolean
  reduceMotion: boolean
}

const defaultPreferences: Preferences = {
  theme: 'light',
  density: 'comfortable',
  emailNotifications: true,
  requestUpdates: true,
  productAnnouncements: false,
  reduceMotion: false,
}

const STORAGE_KEY = 'visionroot-preferences'

function loadPreferences(): Preferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return defaultPreferences

    return {
      ...defaultPreferences,
      ...JSON.parse(stored),
    }
  } catch {
    return defaultPreferences
  }
}

interface PreferencesContextValue {
  preferences: Preferences
  updatePreference: <K extends keyof Preferences>(
    key: K,
    value: Preferences[K],
  ) => void
  resetPreferences: () => void
}

const PreferencesContext = createContext<PreferencesContextValue | undefined>(
  undefined,
)

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: isAuthLoading } = useAuth()
  const [preferences, setPreferences] = useState<Preferences>(loadPreferences)

  useEffect(() => {
    if (isAuthLoading) return

    if (!user) return

    let active = true

    preferencesService
      .getPreferences()
      .then((savedPreferences) => {
        if (active) setPreferences(savedPreferences)
      })
      .catch((error) => {
        console.error('Failed to load account preferences:', error)
      })

    return () => {
      active = false
    }
  }, [user, isAuthLoading])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))

    document.documentElement.dataset.theme = preferences.theme
    document.documentElement.dataset.density = preferences.density
  }, [preferences])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const applyReducedMotion = () => {
      document.documentElement.dataset.reduceMotion = String(
        preferences.reduceMotion || mediaQuery.matches,
      )
    }

    applyReducedMotion()
    mediaQuery.addEventListener('change', applyReducedMotion)

    return () => {
      mediaQuery.removeEventListener('change', applyReducedMotion)
    }
  }, [preferences.reduceMotion])

  const updatePreference = useCallback(
    <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
      setPreferences((current) => ({
        ...current,
        [key]: value,
      }))

      if (user) {
        void preferencesService
          .updatePreferences({ [key]: value })
          .catch((error) => {
            console.error('Failed to save account preference:', error)
          })
      }
    },
    [user],
  )

  const resetPreferences = useCallback(() => {
    setPreferences(defaultPreferences)

    if (user) {
      void preferencesService
        .updatePreferences(defaultPreferences)
        .catch((error) => {
          console.error('Failed to reset account preferences:', error)
        })
    }
  }, [user])

  return (
    <PreferencesContext.Provider
      value={{ preferences, updatePreference, resetPreferences }}
    >
      {children}
    </PreferencesContext.Provider>
  )
}

/* eslint-disable react-refresh/only-export-components */
export function usePreferences(): PreferencesContextValue {
  const context = useContext(PreferencesContext)

  if (!context) {
    throw new Error('usePreferences must be used inside PreferencesProvider.')
  }

  return context
}

