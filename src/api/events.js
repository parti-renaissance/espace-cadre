import { newPaginatedResult } from '~/api/pagination'
import { Event } from '~/domain/event'
import { apiClient, apiClientPublic } from '~/services/networking/client'

export const getEvents = async ({ pageParam: page = 1, onlyMine = false }) => {
  const data = await apiClient.get(
    `/api/v3/events?order[beginAt]=desc&page=${page}&page_size=20${onlyMine ? '&only_mine' : ''}`
  )

  return newPaginatedResult(
    data.items.map(event => Event.fromApi(event)),
    data.metadata
  )
}

export const getMyEvents = args => getEvents({ onlyMine: true, ...args })

export const getEventAttendees = async (id, page) => {
  const data = await apiClient.get(`/api/v3/events/${id}/participants?page=${page}`)

  const attendees = data.items.map(attendee => ({
    emailAddress: attendee.email_address,
    firstName: attendee.first_name,
    lastName: attendee.last_name,
    phone: attendee.phone,
    postalCode: attendee.postal_code,
    subscriptionDate: attendee?.subscription_date,
    tags: attendee.tags,
    type: attendee.type,
  }))

  return newPaginatedResult(attendees, data.metadata)
}

export const getEvent = async id => {
  const event = await apiClient.get(`/api/v3/events/${id}`)

  return Event.fromApi(event)
}

export const getCategories = async () => await apiClientPublic('get', '/api/event_categories')

export const deleteEvent = id => apiClient.delete(`/api/v3/events/${id}`)
export const cancelEvent = id => apiClient.put(`/api/v3/events/${id}/cancel`)
export const createEvent = async ({ event }) => {
  const data = await apiClient.post('/api/v3/events', event)
  return data.uuid
}
export const updateEvent = async ({ event }) => {
  const data = await apiClient.put(`/api/v3/events/${event.id}`, event)
  return data.uuid
}
export const uploadImage = async ({ eventId, image }) => {
  const data = await apiClient.post(`/api/v3/events/${eventId}/image`, { content: `${image}` })
  return data.uuid
}

export const deleteImage = async eventId => await apiClient.delete(`/api/v3/events/${eventId}/image`)
