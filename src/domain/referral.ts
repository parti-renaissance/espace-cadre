import { z } from 'zod'

export enum ReferralStatus {
  AccountCreated = 'account_created',
  InvitationSent = 'invitation_sent',
  AdhesionFinished = 'adhesion_finished',
  AdhesionViaOtherLink = 'adhesion_via_other_link',
  Reported = 'reported',
}

export const ReferralStatusLabels: Record<ReferralStatus, string> = {
  [ReferralStatus.AccountCreated]: 'Compte créé',
  [ReferralStatus.InvitationSent]: 'Invitation envoyée',
  [ReferralStatus.AdhesionFinished]: 'Adhésion finalisée',
  [ReferralStatus.AdhesionViaOtherLink]: 'Adhésion via un autre moyen',
  [ReferralStatus.Reported]: 'Signalé',
}

export enum ReferralType {
  Link = 'link',
  Invitation = 'invitation',
  Preregistration = 'preregistration',
}

export const ReferralTypeLabels: Record<ReferralType, string> = {
  [ReferralType.Link]: 'Lien de parrainage',
  [ReferralType.Invitation]: 'Invitation',
  [ReferralType.Preregistration]: 'Pré-inscription',
}

const RawReferralSchema = z.object({
  uuid: z.string(),
  identifier: z.string(),
  first_name: z.string(),
  status_label: z.string(),
  type_label: z.string(),
  created_at: z.coerce.string(),
  email_address: z.string().nullable(),
  civility: z.string().nullable(),
  last_name: z.string().nullable(),
  nationality: z.string().nullable(),
  phone: z.string().nullable(),
  birthdate: z.string().nullable(),
  referrer: z
    .object({
      id: z.string(),
      uuid: z.string(),
      email_address: z.string(),
      first_name: z.string(),
      last_name: z.string(),
    })
    .nullable(),
})

export const ReferralSchema = RawReferralSchema.transform(raw => ({
  id: raw.uuid,
  identifier: raw.identifier,
  emailAddress: raw.email_address,
  firstName: raw.first_name,
  lastName: raw.last_name,
  civility: raw.civility,
  status: raw.status_label,
  type: raw.type_label,
  createdAt: new Date(raw.created_at),
  referrer: raw.referrer
    ? {
        id: raw.referrer.id,
        firstName: raw.referrer.first_name,
        lastName: raw.referrer.last_name,
        emailAddress: raw.referrer.email_address,
      }
    : null,
}))

export type Referral = z.infer<typeof ReferralSchema>
