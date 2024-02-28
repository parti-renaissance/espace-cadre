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
