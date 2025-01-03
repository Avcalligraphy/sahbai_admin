// Type Imports
import type { ThemeColor } from '@core/types'

export type UsersType = {
  id: number
  roleUser: string
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
  job: string
  reports?: {
    id: number
    victimName?: string
  }[]
  school: {
    id: number
    title: string
  }
  currentPlan: string
  avatarColor?: ThemeColor
}
