export type UserRole = 'ADMIN' | 'MANAGER' | 'ACCOUNTANT' | 'CONTRACTOR'

export type CompanyResponse = {
  id: number
  name: string
  bin: string
}

export type UserResponse = {
  id: number
  email: string
  role: UserRole
  selfEmployed: boolean
  company: CompanyResponse | null
}

export type AuthResponse = {
  accessToken: string
  tokenType: 'Bearer'
  user: UserResponse
}
