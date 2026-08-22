import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import type { ReactNode } from "react"
import { useQueryClient } from "@tanstack/react-query"

import { useMe, useLogin, useLogout } from "@/hooks/use-auth"
import { QUERY_KEYS } from "@/constants/query-keys"
import type { User, LoginPayload } from "@/types"

interface AuthContextValue {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token"),
  )
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user")
    return stored ? JSON.parse(stored) : null
  })

  const queryClient = useQueryClient()
  const { data: meData, isLoading: isMeLoading } = useMe(!!token)
  const loginMutation = useLogin()
  const logoutMutation = useLogout()

  const currentUser = meData?.data?.user ?? user

  // Sync user from /auth/me response to localStorage
  useEffect(() => {
    if (meData?.data?.user) {
      localStorage.setItem("user", JSON.stringify(meData.data.user))
    }
  }, [meData])

  const login = useCallback(
    async (payload: LoginPayload) => {
      const response = await loginMutation.mutateAsync(payload)
      const { user: userData, token: authToken } = response.data
      setToken(authToken)
      setUser(userData)
      localStorage.setItem("token", authToken)
      localStorage.setItem("user", JSON.stringify(userData))
    },
    [loginMutation],
  )

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync()
    setToken(null)
    setUser(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    queryClient.removeQueries({ queryKey: [QUERY_KEYS.ME] })
    queryClient.clear()
  }, [logoutMutation, queryClient])

  const value = useMemo(
    () => ({
      user: currentUser,
      token,
      isAuthenticated: !!token && !!currentUser,
      isLoading: isMeLoading,
      login,
      logout,
    }),
    [currentUser, token, isMeLoading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider")
  }
  return context
}
