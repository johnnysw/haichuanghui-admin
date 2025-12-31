export interface MessageRoot {
  originalId: number
  replyId?: number | null
  createdTime: string
  updatedTime?: string
  content: string
  readTime?: string
  handledTime?: string
  relatedProjectId?: number | null
  fromUserId: number
  fromName?: string
  fromRole?: string
  toUserId: number
  toName?: string
  toRole?: string
}

export interface MessageReply {
  originalId: number
  replyId?: number | null
  createdTime: string
  content: string
  fromUserId: number
  fromName?: string
  fromRole?: string
  toUserId: number
  toName?: string
  toRole?: string
}

export interface MessageThread {
  root: MessageRoot
  replies: MessageReply[]
  lastTime: string
}

export interface MessageQueryParams {
  page: number
  limit: number
  search?: string
  startDate?: string
  endDate?: string
}
