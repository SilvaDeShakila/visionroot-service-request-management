import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { authService } from './services'
import type {
  AuthUser,
} from './types/auth.types'
import type {
  LoginData,
  RegisterData,
} from './services'

interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (data: LoginData) => Promise<AuthUser>
  register: (data: RegisterData) => Promise<AuthUser>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      const response = await authService.getCurrentUser()
      setUser(response.data.user)
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshUser()
  }, [refreshUser])

  const login = async (data: LoginData): Promise<AuthUser> => {
    const response = await authService.login(data)
    setUser(response.data.user)
    return response.data.user
  }

  const register = async (data: RegisterData): Promise<AuthUser> => {
    const response = await authService.register(data)
    setUser(response.data.user)
    return response.data.user
  }

  const logout = async (): Promise<void> => {
    try {
      await authService.logout()
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: user !== null,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider.')
  }

  return context
}
