export interface Category {
  _id?: string
  name: string
  description?: string
  createdDate: string
  totalItemLinked: string
}

export interface CreateCategoryPayload {
  name: string
  description?: string
}

export interface UpdateCategoryPayload {
  name?: string
  description?: string
}

export interface DeleteCategoryPayload {
  _id: string
}