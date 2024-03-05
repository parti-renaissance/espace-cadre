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
