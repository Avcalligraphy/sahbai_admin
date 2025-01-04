export type SchoolsStatus = 'Active' | 'Inactive' | 'Pending' | 'Suspended' | string

export type SchoolUserType = {
  id: number
  username: string
  email: string
  phone?: string
  roleUser: string
  blocked: boolean
}

export type SchoolTeacherType = {
  id: number
  username: string
  email: string
  roleUser: 'teacher'
  job?: string
}

export type SchoolsType = {
  id: number
  title: string
  address: string
  updatedAt: string
  status?: string
  users_permissions_users: {
    data: Array<{
      id: number
      attributes: SchoolUserType
    }>
  }
  teachers: {
    data: Array<{
      id: number
      attributes: SchoolTeacherType
    }>
  }
  schoolsStatus: SchoolsStatus
  createdAt?: string
  publishedAt?: string

  // Tambahan informasi opsional
  totalUsers?: number
  totalTeachers?: number

  user_school?: {
    data?: {
      id?: number
      attributes?: {
        username: string
        email: string
        phone?: string
        roleUser: string
        blocked: boolean
      }
    }
  }
}
