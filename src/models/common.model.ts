import { z } from 'zod'

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

export type Adherent = {
  firstName: string
  lastName: string
  uuid?: string
  pid?: string
  profileImage?: string | null
  emailAddress?: string | null
  phone?: string | null
  age?: number | null
  gender?: GenderEnum | null
}

export const AdherentSchema = z.object({
  id: z.string(),
  uuid: z.string(),
  email_address: z.string(),
  first_name: z.string(),
  gender: z.nativeEnum(GenderEnum),
  last_name: z.string(),
  image_url: z.string().url().nullable(),
})

export interface PaginatedApiQueryBaseModel {
  params: Record<string, unknown>
  signal?: AbortSignal
}

export interface EmailPhoneModel {
  email: string | null
  phone: string | null
}
