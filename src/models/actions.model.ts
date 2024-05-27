import { PostAddressModel } from '~/api/Procuration/procuration.model'
import { AddressZoneModel } from '~/models/activist.model'
import { ReadableLightUserModel } from '~/models/common.model'

export interface ActionAPIFormModel {
  type: ActionEnum
  date: string
  description: string
  post_address: PostAddressModel
}

export interface ActionAPIEditModel {
  type: ActionEnum
  date: string
}

export interface ActionAPIModel extends ActionAPIFormModel {
  zones: AddressZoneModel
  uuid: string
  author: ReadableLightUserModel
}

export enum ActionEnum {
  PAP = 'pap',
  BOITAGE = 'boitage',
}
