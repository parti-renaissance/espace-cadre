import { z } from 'zod'
import { ActionEnum } from '~/models/actions.model'

export const ActionsFormSchema = z.object({
  type: z.nativeEnum(ActionEnum),
  date: z.date().min(new Date()),
  description: z.string().optional(),
  street: z.string(),
  city: z.string(),
  postalCode: z.string(),
})
