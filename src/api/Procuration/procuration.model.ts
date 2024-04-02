import { GenderEnum, ReadableLightUserModel, ReadableLightUserWithGenderModel } from '~/models/common.model'
import { LabelTypeModel } from '~/models/activist.model'

export interface ProcurationModel extends ReadableLightUserModel {
  proxy: ReadableLightUserWithGenderModel | null
  gender: GenderEnum
  birthdate: string
  vote_zone: VoteZoneModel
  created_at: string
  post_address: PostAddressModel
  tags: null | LabelTypeModel[]
  age: number
  vote_place_name: string
  available_proxies_count: number
  id: string
  status: ProcurationStatusEnum
}

export interface ProcurationModelWithPersonalInfos extends ProcurationModel {
  email: string
  phone: string | null
}

export interface PostAddressModel {
  address: string
  postal_code: string
  city: string
  city_name: string
  country: string
  additional_address: PostAddressModel | null
}

export interface VoteZoneModel {
  uuid: string
  type: string
  code: string
  name: string
  created_at: string
}

export enum ProcurationStatusEnum {
  PENDING = 'pending',
  COMPLETED = 'completed',
  EXCLUDED = 'excluded',
}

export interface AvailableProxyModel extends ProcurationModel {
  slots?: number
  requests?: ProcurationModel[]
  email: string
  phone: null | string
  matching_level?: MatchingLevelEnum
}

export enum MatchingLevelEnum {
  COUNTRY = 'country',
  DEPARTMENT = 'department',
  CITY = 'city',
  BOROUGH = 'borough',
  VOTE_PLACE = 'vote_place',
}
