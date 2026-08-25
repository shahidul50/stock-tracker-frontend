export interface StockInHistory {
  _id: string
  itemName: string
  quantity: number
  categoryName: string
  companyName: string
  createdDateTime: string
}

export interface CreateStockInPayload {
  itemId: string
  quantity: number
}

export interface StockInQueryParams {
  searchTerm?: string
  categoryId?: string
  companyId?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
  page?: number
  limit?: number
}
