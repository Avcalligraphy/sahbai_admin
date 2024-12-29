export type AspirationsStatus = 'Paid' | string
export type AspirationsType = {
  id: number
  title: string
  updatedAt: string
  favorite: any
  users_permissions_user?: {
    data?: {
      attributes?: {
        username?: string
      }
    }
  }
  description?: string
  aspirationsStatus: AspirationsStatus
  status: string
  school: {
    data?: {
      attributes?: {
        title?: string
      }
    }
  }
}
