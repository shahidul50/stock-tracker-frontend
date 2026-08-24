import api from "@/lib/axios"
import type {
  ApiResponse,
  PaginatedData,
  PaginationParams,
  SelectOption,
  Company,
  CreateCompanyPayload,
  UpdateCompanyPayload,
} from "@/types"

export const companyService = {
  getAll: async (params?: PaginationParams) => {
    const { data } = await api.get<ApiResponse<PaginatedData<Company>>>(
      "/companies",
      { params },
    )
    return data
  },

  getSelectOptions: async () => {
    const { data } = await api.get<ApiResponse<{ data: SelectOption[] }>>(
      "/companies/select",
    )
    return data
  },

  getById: async (id: string) => {
    const { data } = await api.get<ApiResponse<Company>>(
      `/companies/${id}`,
    )
    return data
  },

  create: async (payload: CreateCompanyPayload) => {
    const { data } = await api.post<ApiResponse<Company>>(
      "/companies",
      payload,
    )
    return data
  },

  update: async (id: string, payload: UpdateCompanyPayload) => {
    const { data } = await api.put<ApiResponse<Company>>(
      `/companies/${id}`,
      payload,
    )
    return data
  },

  delete: async (id: string) => {
    const { data } = await api.delete<ApiResponse<null>>(
      `/companies/${id}`,
    )
    return data
  },
}
