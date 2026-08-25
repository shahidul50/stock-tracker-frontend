import api from "@/lib/axios"
import type {
  ApiResponse,
  PaginatedData,
  SelectOption,
  Items,
  Item,
  ItemQueryParams,
  CreateItemPayload,
  UpdateItemPayload,
} from "@/types"

export const itemService = {
  getAll: async (params?: ItemQueryParams) => {
    const { data } = await api.get<ApiResponse<PaginatedData<Items>>>(
      "/items",
      { params },
    )
    return data
  },

  getSelectOptions: async (categoryId: string, companyId: string) => {
    const { data } = await api.get<ApiResponse<{ data: SelectOption[] }>>(
      "/items/select",
      { params: { categoryId, companyId } },
    )
    return data
  },

  getById: async (id: string) => {
    const { data } = await api.get<ApiResponse<Item>>(`/items/${id}`)
    return data
  },

  create: async (payload: CreateItemPayload) => {
    const { data } = await api.post<ApiResponse<Items>>("/items", payload)
    return data
  },

  update: async (id: string, payload: UpdateItemPayload) => {
    const { data } = await api.put<ApiResponse<Items>>(
      `/items/${id}`,
      payload,
    )
    return data
  },

  delete: async (id: string) => {
    const { data } = await api.delete<ApiResponse<null>>(`/items/${id}`)
    return data
  },
}
