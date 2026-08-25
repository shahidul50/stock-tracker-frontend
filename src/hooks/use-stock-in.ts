import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {toast} from "../components/ui/toast"

import { stockInService } from "@/services/stock-in.service"
import { QUERY_KEYS } from "@/constants/query-keys"
import type { StockInQueryParams, CreateStockInPayload } from "@/types"

export const useStockInHistory = (params?: StockInQueryParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.STOCK_INS, params],
    queryFn: () => stockInService.getAll(params),
  })
}

export const useCreateStockIn = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateStockInPayload) =>
      stockInService.create(payload),
    onSuccess: (data) => {
      toast.add({ description: data.message, type: "success" })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STOCK_INS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ITEMS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STOCK_SUMMARY] })
    },
  })
}
