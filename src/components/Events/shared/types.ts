import { Place, VisibilityEvent } from '~/domain/event'

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
  address: Place
  categoryId?: string
  visibilityId?: VisibilityEvent
  private: boolean
  visioUrl?: string
  liveUrl?: string
  mode?: string
  image?: string | null
  committee?: string | null
  eventLink?: string
}

export enum VisibilityEvent {
  PUBLIC = 'public',
  PRIVATE = 'private',
  ADHERENT = 'adherent',
  ADHERENT_DUES = 'adherent_dues',
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

export interface EventPayload {
  uuid: string
  name: string
  slug: string
  description: string
  time_zone: string
  begin_at: string
  finish_at: string
  organizer: EventOrganizer
  participants_count: number
  status: 'SCHEDULED' // TODO: add other status
  capacity: number
  category: EventCategory
  post_address: PostAddress
  visibility: VisibilityEvent
  live_url: string | null
  visio_url: string | null
  mode: 'online' | 'off'
  image_url: string | null
  link: string
}
