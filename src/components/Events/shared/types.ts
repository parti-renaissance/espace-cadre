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
