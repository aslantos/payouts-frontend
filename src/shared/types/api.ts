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

export type SubmissionResponse = {
  id: number
  taskId: number
  submittedById: number
  content: string
  attachments: string[]
  createdAt: string
}

export type ContractStatus = 'DRAFT' | 'SENT' | 'SIGNED' | 'ACTIVE' | 'CLOSED' | 'CANCELLED'

export type ContractResponse = {
  id: number
  contractNumber: string
  contractorId: number
  subject: string
  amount: number | string
  status: ContractStatus
  signedAt: string | null
  fileUrl: string | null
  createdAt: string
}

export type ContractTemplateResponse = {
  id: number
  name: string
  bodyTemplate: string
  createdAt: string
}

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED'

export type PaymentResponse = {
  id: number
  taskId: number
  contractId: number
  contractorId: number
  amount: number
  status: PaymentStatus
  providerTxId: string
  createdAt: string
  paidAt: string | null
}
