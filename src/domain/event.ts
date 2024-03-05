import PropTypes from 'prop-types'
import { Place } from '~/domain/place'
import { parseDate } from '~/shared/helpers'
import { z } from 'zod'

export class Attendee {
  constructor(firstName, lastName, emailAddress, subscriptionDate, postalCode, type, tags, phone) {
    this.firstName = firstName
    this.lastName = lastName
    this.emailAddress = emailAddress
    this.subscriptionDate = parseDate(subscriptionDate)
    this.postalCode = postalCode
    this.isActivist = type === 'adherent'
    this.tags = tags
    this.phone = phone
  }
}
Attendee.propTypes = PropTypes.shape({
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  emailAddress: PropTypes.string.isRequired,
  subscriptionDate: PropTypes.object.isRequired,
  postalCode: PropTypes.string.isRequired,
  isActivist: PropTypes.bool.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  phone: PropTypes.string,
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

export enum VisibilityEvent {
  PUBLIC = 'public',
  PRIVATE = 'private',
  ADHERENT = 'adherent',
  ADHERENT_DUES = 'adherent_dues',
}

export interface Place {
  id: string
  address: string
  postalCode: string
  cityName: string
  country: string
}

export const CreateEventSchema = z
  .object({
    name: z
      .string()
      .min(5, "Le titre de l'événement doit contenir au moins 5 caractères")
      .min(1, "Le titre de l'événement est obligatoire")
      .max(80, "Le titre de l'événement ne peut pas dépasser 80 caractères"),
    description: z
      .string()
      .min(5, 'La description doit contenir au moins 5 caractères')
      .min(1, 'La description est obligatoire')
      .max(380, 'La description ne peut pas dépasser 380 caractères'),
    timezone: z.string().min(1, 'Vous devez choisir une timezone'),
    private: z.boolean().optional(),
    categoryId: z.string({
      invalid_type_error: 'La catégorie doit être une chaîne de caractères',
      required_error: 'La catégorie est obligatoire',
    }),
    visibilityId: z.nativeEnum(VisibilityEvent, {
      required_error: "La visibilité de l'événement est obligatoire",
    }),
    beginAt: z
      .date({
        invalid_type_error: 'La date de début doit être une date',
        required_error: 'La date de début est obligatoire',
      })
      .or(z.string())
      .transform(arg => new Date(arg)),
    image: z.string().optional(),
    finishAt: z
      .date({
        invalid_type_error: 'La date de fin doit être une date',
        required_error: 'La date de fin est obligatoire',
      })
      .optional()
      .or(z.string()),
    timeBeginAt: z.date().optional(),
    timeFinishAt: z.date().optional(),
    address: z.string().optional(),
    zipCode: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    visioUrl: z.string().optional().or(z.literal('')),
    liveUrl: z
      .string()
      .url({
        message: 'Le lien de la visioconférence doit être une URL',
      })
      .optional()
      .or(z.literal('')),
    capacity: z
      .number({
        invalid_type_error: 'La capacité doit être un nombre',
        required_error: 'La capacité est obligatoire',
      })
      .min(0)
      .optional(),
    isVirtual: z.boolean(),
    severalDays: z.boolean(),
  })
  .superRefine((values, context) => {
    if (values.severalDays && !values.finishAt) {
      return context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La date de fin est obligatoire pour un événement sur plusieurs jours',
        path: ['finishAt'],
      })
    } else if (values.severalDays && values?.finishAt && values?.finishAt < values.beginAt) {
      return context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La date de fin doit être postérieure à la date de début',
        path: ['finishAt'],
      })
    }
  })
  .superRefine((values, context) => {
    if (values.isVirtual && !values.visioUrl) {
      return context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Le lien de la visioconférence est obligatoire pour un événement virtuel',
        path: ['visioUrl'],
      })
    }
  })

export type CreateEventForm = z.infer<typeof CreateEventSchema>
