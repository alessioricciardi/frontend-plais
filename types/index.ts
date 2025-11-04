//Image type
export interface PhotoUploadResponse {
  fileName: string
  url: string
}

//Executive Board types

interface Membership {
  fullName: string
  department: string
  cadenceId: number
  position: number
  role: string
  photoFileName: string
}

export interface ExecutiveMember {
  id?: number
  email: string
  phone: string
  about: string
  memberships: Membership[]
}

export interface Cadence {
  id?: number
  name: string
  position: number
  memberIds: number[]
}

export interface CadenceWithMembers {
  id: number
  name: string
  position: number
  members: {
    executiveMemberId: number
    fullName: string
    department: string
    email: string
    phone: string
    about: string
    role: string
    position: number
    photoFileName: string
  }[]
}

//Member types

export interface Member {
  id: number
  fullName: string
  email: string
  university: string
}

// Event types

export type Event = {
  id: number
  eventGroupId: number
  name: string
  linkUrl: string
}

export type EventGroup = {
  id: number
  title: string
  photoFileName: string
  events: Event[]
}

export type EventGroupResponse = {
  items: EventGroup[]
  totalPages: number
  totalItemsCount: number
  itemsFrom: number
  itemsTo: number
}

export type User = {
  username: string
  password?: string
}

export type Article = {
  id: number
  title: string
  content: EditorData['html']
  dateCreated?: string
  photos?: EditorData['images']
  snippet?: string
}
export type EditorData = {
  html: string
  images?: string[]
}

export type ApiResponse = {
  items: Article[]
  totalPages: number
  totalItemsCount: number
  itemsFrom: number
  itemsTo: number
}

export type Data = {
  html: string
}

export type response = {
  content: string
}

//Resurces types

export type Resource = {
  id: number
  name: string
  groups: ResourceGroup[]
}

export type ResourceGroup = {
  id: number
  name: string
  items: ResourceLink[]
}

export type ResourceLink = {
  id?: number
  name: string
  url: string
}

export type ResourceCategory = {
  id: number
  name: string
}

//Home types

export type HomeText = {
  id: number
  text: string
}

export type CarouselPhoto = {
  id: number
  photoFileName: string
}

export type Achievement = {
  id?: number
  text: string
  dateCreated?: string
  link: string
  images: AchievementImage[]
}

export type AchievementToUpload = {
  text: string
  link: string
  images: string[]
}

export type AchievementImage = {
  id: number
  photoFileName: string
  achievementId: number
}

//Bulletin types

export type latestBulletin = {
  id: number
  title: string
  dateCreated: string
}

export type latestEvent = {
  name: string
  dateCreated: string
}
