import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {toast} from "../components/ui/toast"

import { categoryService } from "@/services/category.service"
import { QUERY_KEYS } from "@/constants/query-keys"
import type {
  PaginationParams,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/types"

export const useCategories = (params?: PaginationParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES, params],
    queryFn: () => categoryService.getAll(params),
  })
}

export const useCategorySelect = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORY_SELECT],
    queryFn: () => categoryService.getSelectOptions(),
  })
}

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORY, id],
    queryFn: () => categoryService.getById(id),
    enabled: !!id,
  })
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) =>
      categoryService.create(payload),
    onSuccess: (data) => {
      toast.add({ description: data.message, type: "success" })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CATEGORY_SELECT],
      })
    },
  })
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateCategoryPayload
    }) => categoryService.update(id, payload),
    onSuccess: (data) => {
      toast.add({description: data.message, type: "success" })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CATEGORY_SELECT],
      })
    },
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => categoryService.delete(id),
    onSuccess: (data) => {
      toast.add({ description: data.message, type: "success"})
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CATEGORY_SELECT],
      })
    },
  })
}
