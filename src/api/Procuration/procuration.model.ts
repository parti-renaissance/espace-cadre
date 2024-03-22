import { ReadableLightUserModel, ReadableLightUserWithGenderModel } from '~/models/common.model'

export interface ProcurationModel extends ReadableLightUserModel {
  proxy: ReadableLightUserWithGenderModel | null
  gender: string
  birthdate: string
  vote_zone: VoteZoneModel
  created_at: string
  post_address: PostAddressModel
  tags: null
  age: number
  vote_place_name: string
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
