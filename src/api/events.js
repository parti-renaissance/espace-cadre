import { newPaginatedResult } from '~/api/pagination'
import { Event, EventCategory, EventGroupCategory } from '~/domain/event'
import { apiClient, apiClientPublic } from '~/services/networking/client'
import { formatDate } from '~/shared/helpers'

const eventToJson = event => ({
  name: event.name,
  category: event.categoryId,
  visibility: event.visibility,
  description: event.description,
  begin_at: event.beginAt,
  finish_at: event.finishAt,
  capacity: parseInt(event.capacity),
  visio_url: event.visioUrl,
  post_address: {
    address: event.address,
    postal_code: event.address?.postalCode,
    city_name: event.address?.city,
    country: event.address?.country,
  },
  time_zone: event.timezone,
  live_url: event.liveUrl,
  mode: event.mode,
})

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

export const formatCategories = rawCategories => {
  const categoriesByGroup = rawCategories.reduce((acc, category) => {
    const categoriesOfCurrentGroup = acc[category.event_group_category.slug] || []
    return {
      ...acc,
      [category.event_group_category.slug]: categoriesOfCurrentGroup.concat(
        new EventCategory(
          category.slug,
          category.name,
          category.event_group_category.slug,
          category.event_group_category.name,
          category.event_group_category.description
        )
      ),
    }
  }, {})

  return Object.keys(categoriesByGroup).map(eventGroupSlug => {
    const eventGroupCategory = rawCategories.find(c => c.event_group_category.slug === eventGroupSlug)
    const { slug, name } = eventGroupCategory.event_group_category
    return new EventGroupCategory(slug, name, categoriesByGroup[eventGroupSlug])
  })
}

export const getCategoriesWithGroups = async () => {
  const rawCategories = await apiClientPublic('get', '/api/event_categories')
  return formatCategories(rawCategories)
}

export const getCategories = async () => {
  const rawCategories = await apiClientPublic('get', '/api/event_categories')
  return rawCategories
}

export const deleteEvent = id => apiClient.delete(`/api/v3/events/${id}`)
export const cancelEvent = id => apiClient.put(`/api/v3/events/${id}/cancel`)
export const createEvent = async ({ event, type }) => {
  const data = await apiClient.post('/api/v3/events', { ...eventToJson(event), type })
  return data.uuid
}
export const updateEvent = async ({ event }) => {
  const data = await apiClient.put(`/api/v3/events/${event.id}`, eventToJson(event))
  return data.uuid
}
export const uploadImage = async ({ eventId, image }) => {
  const data = await apiClient.post(`/api/v3/events/${eventId}/image`, { content: `${image}` })
  return data.uuid
}

export const deleteImage = async eventId => await apiClient.delete(`/api/v3/events/${eventId}/image`)
