export interface Company {
  _id: string
  name: string
  description?: string
  createdDate: string
  totalItemLinked: number
}

export interface CreateCompanyPayload {
  name: string
  description?: string
}

export interface UpdateCompanyPayload {
  name?: string
  description?: string
}
