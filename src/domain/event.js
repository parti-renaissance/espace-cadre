import PropTypes from 'prop-types'
import { Place } from 'domain/place'
import { parseDate } from 'shared/helpers'

export class Attendee {
  constructor(firstName, lastName, subscriptionDate, postalCode, type) {
    this.firstName = firstName
    this.lastName = lastName
    this.subscriptionDate = parseDate(subscriptionDate)
    this.postalCode = postalCode
    this.isActivist = type === 'adherent'
  }
}
Attendee.propTypes = PropTypes.shape({
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  subscriptionDate: PropTypes.object.isRequired,
  postalCode: PropTypes.string.isRequired,
  isActivist: PropTypes.bool.isRequired,
})

export class EventCategory {
  constructor(slug, name, groupSlug, groupName) {
    this.slug = slug
    this.name = name
    this.groupSlug = groupSlug
    this.groupName = groupName
  }
}
EventCategory.propTypes = PropTypes.shape({
  slug: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
})

export class EventGroupCategory {
  constructor(slug, name, categories) {
    this.slug = slug
    this.name = name
    this.categories = categories
  }
}
EventGroupCategory.propTypes = PropTypes.shape({
  slug: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  categories: PropTypes.arrayOf(EventCategory.propTypes).isRequired,
})

export class Event {
  constructor(
    id,
    name,
    description,
    timezone,
    createdAt,
    beginAt,
    finishAt,
    localFinishAt,
    organizer,
    organizerId,
    attendees,
    scheduled,
    capacity,
    address,
    categoryId,
    isPrivate,
    visioUrl,
    mode,
    image,
    committee,
    eventLink
  ) {
    this.id = id
    this.name = name
    this.description = description
    this.timezone = timezone
    this.createdAt = createdAt
    this.beginAt = beginAt
    this.finishAt = finishAt
    this.localFinishAt = localFinishAt
    this.organizer = organizer
    this.organizerId = organizerId
    this.attendees = attendees
    this.scheduled = scheduled
    this.capacity = capacity
    this.address = address
    this.categoryId = categoryId
    this.private = isPrivate
    this.visioUrl = visioUrl
    this.mode = mode
    this.image = image
    this.committee = committee
    this.eventLink = eventLink
  }

  withName = newName =>
    new Event(
      this.id,
      newName,
      this.description,
      this.timezone,
      this.createdAt,
      this.beginAt,
      this.finishAt,
      this.localFinishAt,
      this.organizer,
      this.organizerId,
      this.attendees,
      this.scheduled,
      this.capacity,
      this.address,
      this.categoryId,
      this.private,
      this.visioUrl,
      this.mode,
      this.image
    )

  withPrivate = newPrivate =>
    new Event(
      this.id,
      this.name,
      this.description,
      this.timezone,
      this.createdAt,
      this.beginAt,
      this.finishAt,
      this.localFinishAt,
      this.organizer,
      this.organizerId,
      this.attendees,
      this.scheduled,
      this.capacity,
      this.address,
      this.categoryId,
      newPrivate,
      this.visioUrl,
      this.mode,
      this.image
    )

  static NULL = new Event(
    null,
    '',
    '',
    'Europe/Paris',
    null,
    null,
    null,
    null,
    null,
    '',
    0,
    false,
    '',
    Place.NULL,
    '',
    false,
    '',
    '',
    null
  )

  static fromApi = e =>
    new Event(
      e.uuid,
      e.name,
      e.description,
      e.time_zone,
      parseDate(e.created_at),
      parseDate(e.begin_at),
      parseDate(e.finish_at),
      parseDate(e.local_finish_at),
      [e.organizer?.first_name, e.organizer?.last_name].filter(Boolean).join(' '),
      e.organizer?.uuid,
      e.participants_count,
      e.status === 'SCHEDULED',
      e.capacity,
      new Place(
        '',
        e.post_address.address,
        e.post_address.postal_code,
        e.post_address.city_name,
        e.post_address.country
      ),
      e.category ? e.category.slug : null,
      e.private,
      e.visio_url,
      e.mode,
      e.image_url,
      null,
      e.link
    )
}

Event.propTypes = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  timezone: PropTypes.string.isRequired,
  createdAt: PropTypes.object,
  beginAt: PropTypes.object,
  finishAt: PropTypes.object,
  localFinishAt: PropTypes.object,
  organizer: PropTypes.string,
  organizerId: PropTypes.string.isRequired,
  attendees: PropTypes.number.isRequired,
  scheduled: PropTypes.bool.isRequired,
  capacity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  address: Place.propTypes.isRequired,
  categoryId: PropTypes.string.isRequired,
  private: PropTypes.bool.isRequired,
  visioUrl: PropTypes.string,
  mode: PropTypes.string,
  image: PropTypes.string,
})
