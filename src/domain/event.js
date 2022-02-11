import PropTypes from 'prop-types'
import { Place } from 'domain/place'

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
    electoral,
    visioUrl,
    mode,
    image
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
    this.electoral = electoral
    this.visioUrl = visioUrl
    this.mode = mode
    this.image = image
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
      this.electoral,
      this.visioUrl,
      this.mode,
      this.image
    )

  withDescription = newDescription =>
    new Event(
      this.id,
      this.name,
      newDescription,
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
      this.electoral,
      this.visioUrl,
      this.mode,
      this.image
    )

  withTimezone = newTimezone =>
    new Event(
      this.id,
      this.name,
      this.description,
      newTimezone,
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
      this.electoral,
      this.visioUrl,
      this.mode,
      this.image
    )

  withBeginAt = newBeginAt =>
    new Event(
      this.id,
      this.name,
      this.description,
      this.timezone,
      this.createdAt,
      newBeginAt,
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
      this.electoral,
      this.visioUrl,
      this.mode,
      this.image
    )
  withFinishAt = newFinishAt =>
    new Event(
      this.id,
      this.name,
      this.description,
      this.timezone,
      this.createdAt,
      this.beginAt,
      newFinishAt,
      this.localFinishAt,
      this.organizer,
      this.organizerId,
      this.attendees,
      this.scheduled,
      this.capacity,
      this.address,
      this.categoryId,
      this.private,
      this.electoral,
      this.visioUrl,
      this.mode,
      this.image
    )

  withCapacity = newCapacity =>
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
      newCapacity,
      this.address,
      this.categoryId,
      this.private,
      this.electoral,
      this.visioUrl,
      this.mode,
      this.image
    )

  withAddress = newAddress =>
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
      newAddress,
      this.categoryId,
      this.private,
      this.electoral,
      this.visioUrl,
      this.mode,
      this.image
    )

  withCategory = newCategoryId =>
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
      newCategoryId,
      this.private,
      this.electoral,
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
      this.electoral,
      this.visioUrl,
      this.mode,
      this.image
    )

  withElectoral = newElectoral =>
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
      this.private,
      newElectoral,
      this.visioUrl,
      this.mode,
      this.image
    )

  withVisioUrl = newVisioUrl =>
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
      this.private,
      this.electoral,
      newVisioUrl,
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
    0,
    0,
    false,
    null,
    null,
    '',
    false,
    false,
    '',
    '',
    null
  )
}

Event.propTypes = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  timezone: PropTypes.string.isRequired,
  createdAt: PropTypes.object.isRequired,
  beginAt: PropTypes.object.isRequired,
  finishAt: PropTypes.object.isRequired,
  localFinishAt: PropTypes.object.isRequired,
  organizer: PropTypes.string.isRequired,
  organizerId: PropTypes.string.isRequired,
  attendees: PropTypes.number.isRequired,
  scheduled: PropTypes.bool.isRequired,
  capacity: PropTypes.number,
  address: Place.propTypes.isRequired,
  categoryId: PropTypes.string.isRequired,
  private: PropTypes.bool.isRequired,
  electoral: PropTypes.bool.isRequired,
  visioUrl: PropTypes.string,
  mode: PropTypes.string,
  image: PropTypes.string,
})
