export type ReadingType = {
  id: number
  title: string
  content: any
  writter: string
  updatedAt: string
  image?: {
    data?: {
      attributes?: {
        url?: string
      }
    }
  }
}
