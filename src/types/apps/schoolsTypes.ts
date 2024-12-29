export type SchoolsStatus = 'Paid' | string
export type SchoolsType = {
  id: number
  title: string
  address: string
  updatedAt: string
  status: string
  users_permissions_users: {
    data?: []
  }
  teachers: {
    data?: []
  }
  schoolsStatus: SchoolsStatus
}
