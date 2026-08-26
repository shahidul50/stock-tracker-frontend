import api from "@/lib/axios"
import type {
  ApiResponse,
  StockOutItemResponse,
  CreateStockOutPayload,
  TodayStockOutCount,
} from "@/types"

export const stockOutService = {
  create: async (payload: CreateStockOutPayload) => {
    const { data } = await api.post<ApiResponse<StockOutItemResponse[]>>(
      "/stock-out",
      payload,
    )
    return data
  },

  getTodayCount: async () => {
    const { data } = await api.get<ApiResponse<TodayStockOutCount>>(
      "/stock-out/count/today",
    )
    return data
  },
} 
