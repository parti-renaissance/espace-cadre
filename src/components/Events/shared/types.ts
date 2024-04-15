import { VisibilityEvent, EventGroupCategory } from '~/domain/event'

export interface Category {
  slug: string
  name: string
  description: string
  event_group_category: EventGroupCategory
}

export interface Event {
  id?: string
  name: string
  description?: string
  timezone: string
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

interface EventOrganizer {
  uuid: string
  first_name: string
  last_name: string
}

interface EventCategoryGroup {
  name: string
  slug: string
}

interface EventCategory {
  event_group_category: EventCategoryGroup
  name: string
  slug: string
}

interface PostAddress {
  address: null | string
  postal_code: null | string
  city: null | string
  city_name: null | string
  country: null | string
  latitude: null | number
  longitude: null | number
}
