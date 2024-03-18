import { MinMaxModel } from '~/models/common.model'

export interface FilterCategoryModel {
  label: string
  color: string
  filters: FilterModel[]
}

export interface FilterModel {
  code: string
  label: string
  options: FilterOptionsModel | null
  type: string
  placeholder?: string | null
}

export interface FilterOptionsModel {
  favorite?: boolean
  choices?: string[] | Record<string, string>
  first?: MinMaxModel
  second?: MinMaxModel
  url?: string
  query_param?: string
  value_param?: string
  label_param?: string
  multiple?: boolean
  required?: boolean
}
