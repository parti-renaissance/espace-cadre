export enum GenderEnum {
  MALE = 'male',
  FEMALE = 'female',
}

export interface PaginatedDataModel<Item> {
  metadata: MetadataModel
  items: Item[]
}

export interface MetadataModel {
  total_items: number
  items_per_page: number
  count: number
  current_page: number
  last_page: number
}

export interface MinMaxModel {
  min: number
  max: number
}

export interface KeyValueModel<T = string> {
  key: string
  value: T
}

export interface ReadableLightUserModel {
  first_names: string
  last_name: string
  uuid: string
}

export interface ReadableLightUserModelWithSingleFirstName {
  first_name: string
  last_name: string
  uuid: string
}

export interface ReadableLightUserWithGenderModel extends ReadableLightUserModel {
  gender: GenderEnum
}

export interface LightPersonModel {
  id: string
  firstName: string
  lastName: string
  avatar?: string
  gender: GenderEnum
}

export interface PaginatedApiQueryBaseModel {
  params: Record<string, unknown>
  signal?: AbortSignal
}

export interface EmailPhoneModel {
  email: string | null
  phone: string | null
}
