import { GenderEnum, RenaissanceMembershipEnum } from '~/models/common.model'
import { CountryEnum } from '~/models/country.model'
import { z } from 'zod'

export const ItemSchema = z.object({
  adherent_uuid: z.string(),
  email: z.string(),
  address: z.string(),
  postal_code: z.string(),
  city: z.string(),
  first_name: z.string(),
  birthdate: z.union([z.coerce.date(), z.null()]),
  last_name: z.string(),
  phone: z.union([z.null(), z.string()]),
  created_at: z.coerce.date(),
  interests: z.array(z.string()),
  last_membership_donation: z.union([z.coerce.date(), z.null()]),
  committee: z.union([z.null(), z.string()]),
  committee_uuid: z.union([z.null(), z.string()]),
  additional_tags: z.array(z.string()),
  mandates: z.array(z.string()),
  declared_mandates: z.array(z.string()),
  cotisation_dates: z.array(z.coerce.date()),
  campus_registered_at: z.null(),
  city_code: z.string(),
  sms_subscription: z.boolean(),
  email_subscription: z.boolean(),
})

export interface ActivistModel {
  adherent_uuid: string
  email: string
  address: string
  postal_code: string
  city: string
  country: CountryEnum
  first_name: string
  birthdate: string | null
  last_name: string
  phone: null | string
  nationality: CountryEnum | null
  created_at: string
  gender: GenderEnum
  interests: string[]
  last_membership_donation: string | null
  committee: null | string
  committee_uuid: null | string
  additional_tags: string[]
  mandates: string[]
  declared_mandates: string[]
  cotisation_dates: string[]
  campus_registered_at: null
  renaissance_membership: RenaissanceMembershipEnum | null
  city_code: string
  sms_subscription: boolean
  email_subscription: boolean
}
