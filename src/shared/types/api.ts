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

export type TaskStatus =
  | 'CREATED'
  | 'ACCEPTED'
  | 'IN_PROGRESS'
  | 'SUBMITTED'
  | 'REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'COMPLETED'

export type TaskResponse = {
  id: number
  companyId: number
  createdById: number
  assignedToId: number | null
  contractId: number | null
  title: string
  description: string
  budget: number | string
  deadline: string | null
  status: TaskStatus
  createdAt: string
}
