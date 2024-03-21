export enum GenderEnum {
  MALE = 'male',
  FEMALE = 'female',
}

export enum RenaissanceMembershipEnum {
  SYMPATHIZER = 'sympathizer_re',
  ADHERENT = 'adherent_re',
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
