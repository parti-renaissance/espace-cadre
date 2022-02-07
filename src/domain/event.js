import PropTypes from 'prop-types'

export class Attendee {
  constructor(firstName, lastName, subscriptionDate, postalCode, type) {
    this.firstName = firstName
    this.lastName = lastName
    this.subscriptionDate = new Date(subscriptionDate)
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

export class Address {
  constructor(address, postalCode, city, country, lat, lng) {
    this.address = address
    this.postalCode = postalCode
    this.city = city
    this.country = country
    this.lat = lat
    this.lng = lng
  }
}
Address.propTypes = PropTypes.shape({
  address: PropTypes.string.isRequired,
  postalCode: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
})

export class Event {
  constructor(
    id,
    name,
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
    category,
    isPrivate,
    electoral,
    visioUrl,
    mode,
    image
  ) {
    this.id = id
    this.name = name
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
    this.category = category
    this.isPrivate = isPrivate
    this.electoral = electoral
    this.visioUrl = visioUrl
    this.mode = mode
    this.image = image
  }

  static NULL = new Event(
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    0,
    false,
    0,
    null,
    null,
    false,
    false,
    null,
    null,
    null
  )
}

Event.propTypes = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  timezone: PropTypes.string.isRequired,
  createdAt: PropTypes.object.isRequired,
  beginAt: PropTypes.object.isRequired,
  finishAt: PropTypes.object.isRequired,
  localFinishAt: PropTypes.object.isRequired,
  organizer: PropTypes.string.isRequired,
  organizerId: PropTypes.string.isRequired,
  attendees: PropTypes.number.isRequired,
  scheduled: PropTypes.bool.isRequired,
  capacity: PropTypes.number.isRequired,
  address: Address.propTypes.isRequired,
  category: EventCategory.propTypes.isRequired,
  isPrivate: PropTypes.string.isRequired,
  electoral: PropTypes.string.isRequired,
  visioUrl: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
})
