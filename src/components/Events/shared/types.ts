export interface Event {
  id: string
  name: string
  description: string
  beginAt: string
  endAt: string
  address: any
  visioUrl: string | null
  scheduled: string
  finishAt: string
  organizerId: string
  organizer: string
  category: string | null
  categoryId?: string
  participants_count: number
  attendees: number
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
