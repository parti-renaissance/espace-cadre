import { VisibilityEvent, EventGroupCategory } from '~/domain/event'

export interface Category {
  slug: string
  name: string
  description: string
  event_group_category: EventGroupCategory
  alert: string
}

export interface Event {
  id?: string
  name: string
  description?: string
  timeZone: string
  createdAt?: number | Date
  beginAt?: number | Date
  finishAt?: number | Date
  organizer?: string
  organizerId?: string
  attendees: number
  scheduled: boolean
  capacity?: string | number
  address: {
    address: string
    postalCode: string
    cityName: string
    country: string
  }
  category: Category
  categoryId?: string
  visibilityId?: VisibilityEvent
  visioUrl?: string | null
  liveUrl?: string
  mode?: string
  image?: string | null
  committee?: string | null
  eventLink?: string
}
