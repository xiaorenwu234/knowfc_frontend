export interface Paper {
  name: string
  itemType: string
  parentId: string
  id: string
  type: string
  title: string
  source: string
  authors: string[]
  keywords: string[]
  abstractContent: string
  publishDate: string
  fileUrl: string
  sourceType: string
  uploaderId: number
  uploadTime: string
  tags: string[]
  accepted: boolean
}
