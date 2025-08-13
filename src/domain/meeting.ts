import { z } from 'zod'
import { GenderEnum, LabelTypeModel } from '~/models/common.model'

export enum StatusEnum {
  Pending = 'pending',
  WaitingPayment = 'waiting_payment',
  Accepted = 'accepted',
  Inconclusive = 'inconclusive',
  Refused = 'refused',
  Duplicate = 'duplicate',
  Canceled = 'canceled',
}

export const StatusLabels: Record<StatusEnum, string> = {
  [StatusEnum.Pending]: 'En attente',
  [StatusEnum.WaitingPayment]: 'En attente de paiement',
  [StatusEnum.Accepted]: 'Accepté',
  [StatusEnum.Inconclusive]: 'Non concluant',
  [StatusEnum.Refused]: 'Refusé',
  [StatusEnum.Duplicate]: 'Doublon',
  [StatusEnum.Canceled]: 'Annulé',
}

enum PaymentStatusEnum {
  Unknown = 'unknown',
  Pending = 'pending',
  Confirmed = 'confirmed',
  Error = 'error',
  Expired = 'expired',
  Refunded = 'refunded',
}

export const PaymentStatusLabels: Record<PaymentStatusEnum, string> = {
  [PaymentStatusEnum.Unknown]: 'Statut inconnu',
  [PaymentStatusEnum.Pending]: 'En attente',
  [PaymentStatusEnum.Confirmed]: 'Paiement confirmé',
  [PaymentStatusEnum.Error]: 'Erreur de paiement',
  [PaymentStatusEnum.Expired]: 'Paiement expiré',
  [PaymentStatusEnum.Refunded]: 'Remboursé',
}

const RawInscriptionSchema = z.object({
  uuid: z.string(),
  gender: z.nativeEnum(GenderEnum),
  first_name: z.string(),
  last_name: z.string(),
  status: z.nativeEnum(StatusEnum),
  payment_status: z.nativeEnum(PaymentStatusEnum),
  address_email: z.string(),
  phone: z.string().nullable(),
  image_url: z.string().url().nullable(),
  visit_day: z.string(),
  transport: z.string(),
  amount: z.number().nullable(),
  accommodation: z.string().nullable(),
  accessibility: z.string().nullable(),
  is_j_a_m: z.boolean(),
  created_at: z.coerce.string(),
  updated_at: z.coerce.string(),
  confirmed_at: z.coerce.string().nullable(),
  tags: z.array(z.custom<LabelTypeModel>()).nullable(),
  roommate_identifier: z.string().nullable(),
})

export const InscriptionSchema = RawInscriptionSchema.transform(raw => ({
  id: raw.uuid,
  gender: raw.gender,
  status: raw.status,
  paymentStatus: raw.payment_status,
  firstName: raw.first_name,
  lastName: raw.last_name,
  emailAddress: raw.address_email,
  phone: raw.phone,
  imageUrl: raw.image_url,
  visitDay: raw.visit_day,
  transport: raw.transport,
  accommodation: raw.accommodation,
  isJAM: raw.is_j_a_m,
  accessibility: raw.accessibility,
  amount: raw.amount || 0,
  createdAt: new Date(raw.created_at),
  updatedAt: new Date(raw.updated_at),
  confirmedAt: raw.confirmed_at ? new Date(raw.confirmed_at) : null,
  tags: raw.tags,
  roommateIdentifier: raw.roommate_identifier,
}))

export type Inscription = z.infer<typeof InscriptionSchema>
