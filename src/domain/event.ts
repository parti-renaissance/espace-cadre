import PropTypes from 'prop-types'
import { parseDate } from '~/shared/helpers'
import { z } from 'zod'
import { Place } from '~/domain/place'

export class Attendee {
  static propTypes = {
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    subscriptionDate: PropTypes.object.isRequired,
    postalCode: PropTypes.string.isRequired,
    isActivist: PropTypes.bool.isRequired,
  }

  constructor(
    public firstName: string,
    public lastName: string,
    public subscriptionDate: Date,
    public postalCode: string,
    public isActivist: boolean
  ) {}
}

export class EventCategory {
  static propTypes = {
    slug: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    groupSlug: PropTypes.string.isRequired,
    groupName: PropTypes.string.isRequired,
  }

  constructor(
    public slug: string,
    public name: string,
    public groupSlug: string,
    public groupName: string
  ) {}
}

export class EventGroupCategory {
  static propTypes = {
    slug: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    categories: PropTypes.arrayOf(PropTypes.shape(EventCategory.propTypes)).isRequired,
  }

  constructor(
    public slug: string,
    public name: string,
    public categories: EventCategory[]
  ) {}
}

export class Event {
  static propTypes = {
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    timezone: PropTypes.string.isRequired,
    visibility: PropTypes.string.isRequired,
    createdAt: PropTypes.object,
    beginAt: PropTypes.object,
    finishAt: PropTypes,
    localFinishAt: PropTypes,
    organizer: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
    }),
    organizerId: PropTypes.string.isRequired,
    attendees: PropTypes.number.isRequired,
    scheduled: PropTypes.bool.isRequired,
    capacity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    address: Place.propTypes.isRequired,
    category: PropTypes.shape({
      description: PropTypes.string,
      event_group_category: PropTypes.shape({
        description: PropTypes.string,
        name: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired,
      }),
    }),
    isPrivate: PropTypes.bool.isRequired,
    visioUrl: PropTypes.string,
    liveUrl: PropTypes.string,
    mode: PropTypes.string,
    image: PropTypes.string,
    editable: PropTypes.bool,
  }

  public static fromApi = (e: any) =>
    new Event(
      e.uuid,
      e.name,
      e.description,
      e.time_zone,
      e.visibility,
      parseDate(e.created_at),
      parseDate(e.begin_at),
      parseDate(e.finish_at),
      parseDate(e.local_finish_at),
      [e.organizer?.first_name, e.organizer?.last_name].filter(Boolean).join(' '),
      e.organizer?.uuid,
      e.participants_count,
      e.status === 'SCHEDULED',
      e.capacity,
      {
        address: e.post_address.address,
        postalCode: e.post_address.postal_code,
        cityName: e.post_address.city_name,
        country: e.post_address.country,
      },
      e.category ? e.category : null,
      e.private,
      e.visio_url,
      e.live_url,
      e.mode,
      e.image_url,
      e.editable
    )

  public withName = (newName: string) =>
    new Event(
      this.id,
      newName,
      this.description,
      this.timezone,
      this.visibility,
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
      this.category,
      this.isPrivate,
      this.visioUrl,
      this.liveUrl,
      this.mode,
      this.image,
      this.editable
    )

  constructor(
    public id: string,
    public name: string,
    public description: string,
    public timezone: string,
    public visibility: string,
    public createdAt: Date,
    public beginAt: Date,
    public finishAt: Date,
    public localFinishAt: Date,
    public organizer: string,
    public organizerId: string,
    public attendees: number,
    public scheduled: boolean,
    public capacity: string,
    public address: {
      address: string
      postalCode: string
      cityName: string
      country: string
    },
    public category: {
      description: string
      name: string
      slug: string
      event_group_category: {
        description: string
        name: string
        slug: string
      }
    },
    public isPrivate: boolean,
    public visioUrl: string,
    public liveUrl: string,
    public mode: string,
    public image: string,
    public editable: boolean
  ) {}
}

export enum VisibilityEvent {
  PUBLIC = 'public',
  PRIVATE = 'private',
  ADHERENT = 'adherent',
  ADHERENT_DUES = 'adherent_dues',
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
      .min(10, 'La description doit contenir au moins 10 caractères')
      .min(1, 'La description est obligatoire')
      .max(380, 'La description ne peut pas dépasser 380 caractères'),
    timezone: z.string().min(1, 'Vous devez choisir une timezone'),
    private: z.boolean().optional(),
    categoryId: z.string({
      invalid_type_error: 'La catégorie doit être une chaîne de caractères',
      required_error: 'La catégorie est obligatoire',
    }),
    visibility: z.nativeEnum(VisibilityEvent, {
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
    address: z
      .object({
        address: z.string().optional(),
        postalCode: z.string().optional(),
        cityName: z.string().optional(),
        country: z.string().optional(),
      })
      .optional(),
    visioUrl: z
      .string()
      .url({
        message: 'Le lien de la visioconférence doit être une URL',
      })
      .optional()
      .or(z.literal('')),
    liveUrl: z
      .string()
      .url({
        message: 'Le lien de live doit être une URL',
      })
      .optional()
      .or(z.literal('')),
    capacity: z.coerce.string().optional(),
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

    if (!values.isVirtual) {
      const checkHasAddressFull =
        values.address?.address && values.address?.postalCode && values.address?.cityName && values.address?.country
      if (!checkHasAddressFull) {
        return context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "L'adresse est obligatoire pour un événement physique",
          path: ['address'],
        })
      }
    }
  })

export type CreateEventForm = z.infer<typeof CreateEventSchema>
