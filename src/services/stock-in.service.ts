import api from "@/lib/axios"
import type {
  ApiResponse,
  PaginatedData,
  StockInHistory,
  StockInQueryParams,
  CreateStockInPayload,
} from "@/types"

export const stockInService = {
  getAll: async (params?: StockInQueryParams) => {
    const { data } = await api.get<ApiResponse<PaginatedData<StockInHistory>>>(
      "/stock-in",
      { params },
    )
    return data
  },

  create: async (payload: CreateStockInPayload) => {
    const { data } = await api.post<ApiResponse<CreateStockInPayload>>(
      "/stock-in",
      payload,
    )
    return data
  },
}
