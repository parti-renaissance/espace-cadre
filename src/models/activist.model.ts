import { GenderEnum, LabelTypeModel } from '~/models/common.model'
import { CountryEnum } from '~/models/country.model'

export interface ActivistModel {
  public_id: string
  adherent_uuid: string
  image_url: string | null
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
  mandates: string[]
  declared_mandates: string[]
  cotisation_dates: string[]
  campus_registered_at: null
  city_code: string
  sms_subscription: boolean
  email_subscription: boolean
  tags: LabelTypeModel[]
  zones: AddressZoneModel[]
  age: number
}

export interface AddressZoneModel {
  uuid: string
  type: ZoneEnum
  code: string
  name: string
}

export enum ZoneEnum {
  CUSTOM = 'custom',
  COUNTRY = 'country',
  REGION = 'region',
  DEPARTMENT = 'department',
  DISTRICT = 'district',
  CITY = 'city',
  BOROUGH = 'borough',
  CITY_COMMUNITY = 'city_community',
  CANTON = 'canton',
  FOREIGN_DISTRICT = 'foreign_district',
  CONSULAR_DISTRICT = 'consular_district',
  VOTE_PLACE = 'vote_place',
  FDE_CODE = 'FDE',
}
