import { useMutation, useQuery } from "@tanstack/react-query"

import { authService } from "@/services/auth.service"
import { QUERY_KEYS } from "@/constants/query-keys"
import type { LoginPayload } from "@/types"

export const useMe = (enabled: boolean = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ME],
    queryFn: () => authService.getMe(),
    enabled,
    retry: false,
  })
}

export const useLogin = () => {
  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
  })
}

export const useLogout = () => {
  return useMutation({
    mutationFn: () => authService.logout(),
  })
} 
