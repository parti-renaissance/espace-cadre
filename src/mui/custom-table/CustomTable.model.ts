import { ReactElement } from 'react'

export interface CustomTableColumnModel<DataType extends RowWithIdModel> {
  title: string
  subTitle?: string
  // Data index, mostly the name of the row in api return, nothing in example for actions on line
  index?: keyof DataType
  render?: (props: DataType) => ReactElement | string
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify'
  width?: number
  minWidth?: number
  hidden?: boolean
  sortable?: boolean
}

export enum OrderEnum {
  ASC = 'asc',
  DESC = 'desc',
}

export interface RowWithIdModel {
  id: string | number
}
