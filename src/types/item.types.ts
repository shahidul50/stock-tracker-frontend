export interface Items {
  id: string
  name: string
  categoryName: string
  companyName: string
  reorderLevel: number
  availableQuantity: number
  status: string
}

export interface Item {
  id: string
  name: string
  description?: string
  category: {
    id: string
    name: string
  }
  company: {
    id: string
    name: string
  }
  reorderLevel: number
  availableQuantity: number
  status: string
}


export interface CreateItemPayload {
  name: string
  categoryId: string
  companyId: string
  reorderLevel: number
  description?: string
}

export interface UpdateItemPayload {
  name?: string
  categoryId: string
  companyId: string
  reorderLevel?: number
  description?: string
}

export interface ItemQueryParams {
  searchTerm?: string
  categoryId?: string
  companyId?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
  page?: number
  limit?: number
}
