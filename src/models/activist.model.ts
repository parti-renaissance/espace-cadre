import { GenderEnum, RenaissanceMembershipEnum } from '~/models/common.model'
import { CountryEnum } from '~/models/country.model'

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
