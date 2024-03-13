import { EventGroupCategory } from '~/domain/event'

export interface Category {
  slug: string
  name: string
  description: string
  event_group_category: EventGroupCategory
}

export interface Event {
  id: string
  name: string
  description: string
  image: string
  beginAt: string
  endAt: string
  address: any
  visioUrl: string | null
  scheduled: string
  finishAt: string
  organizerId: string
  organizer: string
  category: Category
  categoryId?: string
  participants_count: number
  attendees: number
}

// OLD EVENT TYPE EVENT V2 1210

// import { Place, VisibilityEvent } from '~/domain/event'
//
// export interface Event {
//   id?: string
//   name: string
//   description?: string
//   timezone: string
//   createdAt?: number | Date
//   beginAt?: number | Date
//   finishAt?: number | Date
//   organizer?: string
//   organizerId?: string
//   attendees: number
//   scheduled: boolean
//   capacity?: string | number
//   address: Place
//   categoryId?: string
//   visibilityId?: VisibilityEvent
//   private: boolean
//   visioUrl?: string
//   liveUrl?: string
//   mode?: string
//   image?: string | null
//   committee?: string | null
//   eventLink?: string
// }
