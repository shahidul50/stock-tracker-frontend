import api from "@/lib/axios"
import type {
  ApiResponse,
  PaginatedData,
  PaginationParams,
  SelectOption,
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/types"

export const categoryService = {
  getAll: async (params?: PaginationParams) => {
    const { data } = await api.get<ApiResponse<PaginatedData<Category>>>(
      "/categories",
      { params },
    )
    return data
  },

  getSelectOptions: async () => {
    const { data } = await api.get<ApiResponse<{ data: SelectOption[] }>>(
      "/categories/select",
    )
    return data
  },

  getById: async (id: string) => {
    const { data } = await api.get<ApiResponse<Category>>(
      `/categories/${id}`,
    )
    return data
  },

  create: async (payload: CreateCategoryPayload) => {
    const { data } = await api.post<ApiResponse<Category>>(
      "/categories",
      payload,
    )
    return data
  },

  update: async (id: string, payload: UpdateCategoryPayload) => {
    const { data } = await api.put<ApiResponse<Category>>(
      `/categories/${id}`,
      payload,
    )
    return data
  },

  delete: async (id: string) => {
    const { data } = await api.delete<ApiResponse<null>>(
      `/categories/${id}`,
    )
    return data
  },
}
