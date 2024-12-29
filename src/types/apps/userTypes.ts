// Type Imports
import type { ThemeColor } from '@core/types'

export type UsersType = {
  id: number
  role: string
  email: string
  status: string
  avatar: string
  company: string
  country: string
  contact: string
  fullName: string
  username: string
  blocked: boolean
  updatedAt: string
  phone: string
  school: {
    title: string
  }
  currentPlan: string
  avatarColor?: ThemeColor
}
