// Generic API response envelope
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

// Paginated data wrapper
export interface PaginatedMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface PaginatedData<T> {
  data: T[]
  meta: PaginatedMeta
}

// Select dropdown option
export interface SelectOption {
  label: string
  value: string
}

// API error response
export interface ApiErrorResponse {
  success: false
  code?: string
  message: string
}

// Common query params
export interface PaginationParams {
  page?: number
  limit?: number
  searchTerm?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}
