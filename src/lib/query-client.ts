import { QueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "../components/ui/toast"

import type { ApiErrorResponse } from "@/types"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error) => {
        const axiosError = error as AxiosError<ApiErrorResponse>
        const message =
          axiosError.response?.data?.message || "Something went wrong!"
          toast.add({
            description: message,
            type: "error",
            priority: "high"
          })
      },
    },
  },
})