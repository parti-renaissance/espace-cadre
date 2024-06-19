import {
  EmailPhoneModel,
  GenderEnum,
  ReadableLightUserModel,
  ReadableLightUserModelWithSingleFirstName,
  ReadableLightUserWithGenderModel,
} from '~/models/common.model'
import { LabelTypeModel } from '~/models/activist.model'

export interface ProcurationModel extends ReadableLightUserModel {
  proxy_slots: SlotModel[] | null
  request_slots: SlotModel[] | null
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
  matched_at: string | null
  matcher: ReadableLightUserModelWithSingleFirstName | null
  // Indicate if mandate will sign procuration in French soil
  from_france: boolean
}

export interface ProcurationDetailsModel extends ReadableLightUserModel {
  email: string
  phone: string | null
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
  matched_at: string | null
  matcher: ReadableLightUserModelWithSingleFirstName | null
  proxy_slots: SlotModel[] | null
  request_slots: SlotModel[] | null
  // Indicate if mandate will sign procuration in French soil
  from_france: boolean
}

export interface ProcurationProxyDetailModel extends EmailPhoneModel {
  first_names: string
  last_name: string
  uuid: string
  id: string
  vote_place_name: string
  vote_zone: VoteZoneModel
  age: number
  post_address: PostAddressModel
  created_at: string
  tags: null | LabelTypeModel[]
}

export type ProcurationModelWithPersonalInfos = ProcurationModel & EmailPhoneModel

export interface ReadableLightUserWithGenderModelWithMatcher extends ReadableLightUserWithGenderModel {
  gender: GenderEnum
  matched_at: string | null
  matcher: ReadableLightUserModelWithSingleFirstName | null
}

export interface RoundModel {
  uuid: string
  created_at: string
  name: string
  date: string
}

export interface SlotModel {
  uuid: string
  created_at: string
  round: RoundModel
  manual: boolean
  request: null | ProcurationProxyDetailModel
  proxy: null | ProcurationProxyDetailModel
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
  MANUAL = 'manual',
  COMPLETED = 'completed',
  EXCLUDED = 'excluded',
  DUPLICATE = 'duplicate',
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
