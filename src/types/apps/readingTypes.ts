export type RichTextContent =
  | {
      type: 'paragraph'
      children: RichTextChild[]
    }
  | {
      type: 'heading'
      level: number
      children: RichTextChild[]
    }
  | {
      type: 'list'
      format: 'ordered' | 'unordered'
      children: {
        type: 'list-item'
        children: RichTextChild[]
      }[]
    }
  | {
      type: 'quote'
      children: RichTextChild[]
    }

export type RichTextChild = {
  type?: 'text' | 'link'
  text?: string
  url?: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  children?: { type: 'text'; text: string }[]
}
export type ReadingType = {
  id?: number
  title: string
  content: RichTextContent[]
  writter?: string
  updatedAt?: string
  createdAt?: string
  school?: {
    data?: {
      id: number
      attributes?: {
        title?: string
      }
    }
  }
  image?: {
    data?: {
      id: number
      attributes?: {
        name?: string
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
}
