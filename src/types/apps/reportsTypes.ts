export type ReportsType = {
  id: number
  victimName: string
  victimClass: string
  victimGender: string
  perpetratorName: string
  perpetratorClass: string
  perpetratorGender: string
  dateIncident: string
  noteIncident: string
  timeIncident: string
  locationIncident: string
  status: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  photoIncident?: {
    data?: {
      id: number
      attributes?: {
        url?: string
        formats?: {
          thumbnail?: { url: string }
          medium?: { url: string }
          small?: { url: string }
          large?: { url: string }
        }
      }
    }
  }
  teacher?: {
    data?: {
      id: number
      attributes?: {
        name?: string
        job?: string
      }
    }
  }
  user?: {
    data?: {
      id: number
      attributes?: {
        username?: string
        email?: string
        roleUser?: string
        job?: string
      }
    }
  }
}
