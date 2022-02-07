import { apiClient } from 'services/networking/client'
import { newPaginatedResult } from 'api/pagination'
import { Address, Event, EventCategory, EventGroupCategory, Attendee } from 'domain/event'

export const getEvents = async ({ pageParam: page = 1 }) => {
  const data = await apiClient.get(`/api/v3/events?order[finish_at]=desc&page=${page}&page_size=20`)

  const events = data.items.map(
    e =>
      new Event(
        e.uuid,
        e.name,
        e.time_zone,
        new Date(e.created_at),
        new Date(e.begin_at),
        new Date(e.finish_at),
        new Date(e.local_finish_at),
        [e.organizer?.first_name, e.organizer?.last_name].filter(Boolean).join(' '),
        e.organizer?.uuid,
        e.participants_count,
        e.status === 'SCHEDULED',
        e.capacity,
        new Address(
          e.post_address.address,
          e.post_address.postal_code,
          e.post_address.city_name,
          e.post_address.country,
          e.post_address.latitude,
          e.post_address.longitude
        ),
        new EventCategory(
          e.category.slug,
          e.category.name,
          e.category.event_group_category.slug,
          e.category.event_group_category.name
        ),
        e.private,
        e.electoral,
        e.visio_url,
        e.mode,
        e.image_url
      )
  )

  return newPaginatedResult(events, data.metadata)
}

export const getEventAttendees = async id => {
  const data = await apiClient.get(`/api/v3/events/${id}/participants`)

  const attendees = data.items.map(
    p => new Attendee(p.first_name, p.last_name, p.subscription_date, p.postal_code, p.type)
  )

  return newPaginatedResult(attendees, data.metadata)
}

export const getEvent = async id => {
  const event = await apiClient.get(`/api/v3/events/${id}`)

  return new Event(
    event.uuid,
    event.name,
    event.time_zone,
    new Date(event.created_at),
    new Date(event.begin_at),
    new Date(event.finish_at),
    new Date(event.local_finish_at),
    [event.organizer?.first_name, event.organizer?.last_name].filter(Boolean).join(' '),
    event.organizer?.uuid,
    event.participants_count,
    event.status === 'SCHEDULED',
    event.capacity,
    new Address(
      event.post_address.address,
      event.post_address.postal_code,
      event.post_address.city_name,
      event.post_address.country,
      event.post_address.latitude,
      event.post_address.longitude
    ),
    new EventCategory(
      event.category.slug,
      event.category.name,
      event.category.event_group_category.slug,
      event.category.event_group_category.name
    ),
    event.private,
    event.electoral,
    event.visio_url,
    event.mode,
    event.image_url
  )
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
          category.event_group_category.name
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

export const getCategories = async () => {
  const { data: rawCategories } = await apiClient.get('/api/v3/event_categories')
  return formatCategories(rawCategories)
}

export const deleteEvent = id => apiClient.delete(`/api/v3/events/${id}`)
export const cancelEvent = id => apiClient.put(`/api/v3/events/${id}`)
export const createEvent = event => apiClient.post('/api/v3/events', event)
export const updateEvent = event => apiClient.post('/api/v3/events/${event.id}', event)
