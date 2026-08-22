export interface User {
  id: string
  name: string
  email: string
  role: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}

export interface MeResponse {
  user: User
}
