import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {toast} from "../components/ui/toast"

import { stockOutService } from "@/services/stock-out.service"
import { QUERY_KEYS } from "@/constants/query-keys"
import type { CreateStockOutPayload } from "@/types"

export const useTodayStockOutCount = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.STOCK_OUT_TODAY_COUNT],
    queryFn: () => stockOutService.getTodayCount(),
  })
}

export const useRecordStockOut = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateStockOutPayload) =>
      stockOutService.create(payload),
    onSuccess: (data) => {
      toast.add({ description: data.message, type: "success" })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STOCK_OUT_TODAY_COUNT],
      })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ITEMS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STOCK_SUMMARY] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SALES_REPORT] })
    },
  })
}
