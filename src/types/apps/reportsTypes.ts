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
  updatedAt: string
  photoIncident?: {
    data?: {
      attributes?: {
        url?: string
      }
    }
  }
  teacher?: {
    data?: {
      attributes?: {
        name?: string
      }
    }
  }
}
