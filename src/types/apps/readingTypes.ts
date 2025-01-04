export type ReadingType = {
  id: number
  title: string
  content: any
  writter: string
  updatedAt: string
  createdAt: string
  school: {
    data?: {
      attributes?: {
        title?: string
      }
    }
  }
  image?: {
    data?: {
      attributes?: {
        url?: string
      }
    }
  }
}
