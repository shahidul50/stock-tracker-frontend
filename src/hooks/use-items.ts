import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {toast} from "../components/ui/toast"

import { itemService } from "@/services/item.service"
import { QUERY_KEYS } from "@/constants/query-keys"
import type {
  ItemQueryParams,
  CreateItemPayload,
  UpdateItemPayload,
} from "@/types"

export const useItems = (params?: ItemQueryParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ITEMS, params],
    queryFn: () => itemService.getAll(params),
  })
}

export const useItemSelect = (categoryId: string, companyId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ITEM_SELECT, categoryId, companyId],
    queryFn: () => itemService.getSelectOptions(categoryId, companyId),
    enabled: !!categoryId && !!companyId,
  })
}

export const useItem = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ITEM, id],
    queryFn: () => itemService.getById(id),
    enabled: !!id,
  })
}

export const useCreateItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateItemPayload) => itemService.create(payload),
    onSuccess: (data) => {
      toast.add({ description: data.message, type: "success" })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ITEMS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ITEM_SELECT] })
    },
  })
}

export const useUpdateItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateItemPayload
    }) => itemService.update(id, payload),
    onSuccess: (data) => {
      toast.add({ description: data.message, type: "success" })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ITEMS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ITEM_SELECT] })
    },
  })
}

export const useDeleteItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => itemService.delete(id),
    onSuccess: (data) => {
      toast.add({ description: data.message, type: "success" })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ITEMS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ITEM_SELECT] })
    },
  })
}
