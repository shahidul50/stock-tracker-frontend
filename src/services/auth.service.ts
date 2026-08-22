import api from "@/lib/axios"
import type { ApiResponse, LoginPayload, LoginResponse, MeResponse } from "@/types"

export const authService = {
  login: async (payload: LoginPayload) => {
    const { data } = await api.post<ApiResponse<LoginResponse>>(
      "/auth/login",
      payload,
    )
    return data
  },

  logout: async () => {
    const { data } = await api.post<ApiResponse<null>>("/auth/logout")
    return data
  },

  getMe: async () => {
    const { data } = await api.get<ApiResponse<MeResponse>>("/auth/me")
    return data
  },
}
