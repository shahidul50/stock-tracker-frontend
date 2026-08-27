import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "../components/ui/toast"

import { companyService } from "@/services/company.service"
import { QUERY_KEYS } from "@/constants/query-keys"
import type {
  PaginationParams,
  CreateCompanyPayload,
  UpdateCompanyPayload,
} from "@/types"

export const useCompanies = (params?: PaginationParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COMPANIES, params],
    queryFn: () => companyService.getAll(params),
  })
}

export const useCompanySelect = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.COMPANY_SELECT],
    queryFn: () => companyService.getSelectOptions(),
  })
}

export const useCompany = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COMPANY, id],
    queryFn: () => companyService.getById(id),
    enabled: !!id,
  })
}

export const useCreateCompany = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateCompanyPayload) =>
      companyService.create(payload),
    onSuccess: (data) => {
      toast.add({ description: data.message, type: "success" })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPANIES] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMPANY_SELECT],
      })
    },
  })
}

export const useUpdateCompany = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateCompanyPayload
    }) => companyService.update(id, payload),
    onSuccess: (data) => {
      toast.add({ description: data.message, type: "success" })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPANIES] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMPANY_SELECT],
      })

      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SALES_REPORT] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STOCK_SUMMARY] })
    },
  })
}

export const useDeleteCompany = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => companyService.delete(id),
    onSuccess: (data) => {
      toast.add({ description: data.message, type: "success" })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COMPANIES] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COMPANY_SELECT],
      })

      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ITEMS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ITEM_SELECT] })

      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SALES_REPORT] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STOCK_SUMMARY] })
    },
  })
}
