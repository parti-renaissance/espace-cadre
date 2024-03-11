import { ReactNode } from 'react'

export interface CustomTableColumnModel<DataType extends RowWithIdModel> {
  title: string
  // Data index, mostly the name of the row in api return
  index: keyof DataType
  render?: (props: DataType) => ReactNode
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify'
  width?: number
  minWidth?: number
}

export enum OrderEnum {
  ASC = 'asc',
  DESC = 'desc',
}

export interface RowWithIdModel {
  id: string | number
}
