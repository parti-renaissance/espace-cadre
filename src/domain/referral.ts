import { z } from 'zod'
import { Adherent, AdherentSchema } from '~/models/common.model'

export enum ReferralStatusEnum {
  AccountCreated = 'account_created',
  InvitationSent = 'invitation_sent',
  AdhesionFinished = 'adhesion_finished',
  AdhesionViaOtherLink = 'adhesion_via_other_link',
  Reported = 'reported',
}

export const ReferralStatusLabels: Record<ReferralStatusEnum, string> = {
  [ReferralStatusEnum.AccountCreated]: 'Adhésion incomplète',
  [ReferralStatusEnum.InvitationSent]: 'Invitation envoyée',
  [ReferralStatusEnum.AdhesionFinished]: 'Adhésion finalisée',
  [ReferralStatusEnum.AdhesionViaOtherLink]: 'Adhésion via un autre moyen',
  [ReferralStatusEnum.Reported]: 'Signalé',
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
  status: z.nativeEnum(ReferralStatusEnum),
  type_label: z.string(),
  created_at: z.coerce.string(),
  email_address: z.string().nullable(),
  civility: z.string().nullable(),
  last_name: z.string().nullable(),
  nationality: z.string().nullable(),
  phone: z.string().nullable(),
  birthdate: z.string().nullable(),
  referred: AdherentSchema.nullable(),
  referrer: AdherentSchema.nullable(),
})

export const ReferralSchema = RawReferralSchema.transform(raw => {
  const referrer: Adherent | null = raw.referrer
    ? {
        pid: raw.referrer.id,
        uuid: raw.referrer.uuid,
        firstName: raw.referrer.first_name,
        gender: raw.referrer.gender,
        lastName: raw.referrer.last_name,
        emailAddress: raw.referrer.email_address,
        profileImage: raw.referrer.image_url,
      }
    : null

  const referred: Adherent | null = raw.referred
    ? {
        pid: raw.referred.id,
        uuid: raw.referred.uuid,
        firstName: raw.referred.first_name,
        lastName: raw.referred.last_name,
        gender: raw.referred.gender,
        emailAddress: raw.referred.email_address,
        profileImage: raw.referred.image_url,
      }
    : {
        firstName: raw.first_name,
        lastName: raw.last_name || '',
        emailAddress: raw.email_address,
      }

  return {
    id: raw.uuid,
    identifier: raw.identifier,
    civility: raw.civility,
    status: raw.status,
    type: raw.type_label,
    createdAt: new Date(raw.created_at),
    referrer: referrer,
    referred: referred,
  }
})

export type Referral = z.infer<typeof ReferralSchema>

export const RawScoreboardReferrerSchema = z.object({
  pid: z.string(),
  uuid: z.string().uuid(),
  first_name: z.string(),
  last_name: z.string(),
  profile_image: z.string().url().nullable(),
  count_adhesion_finished: z.number(),
  count_account_created: z.number(),
  count_reported: z.number(),
})

export const ScoreboardReferrerSchema = RawScoreboardReferrerSchema.transform(
  (raw): ScoreboardReferrer => ({
    adherent: {
      uuid: raw.uuid,
      pid: raw.pid,
      firstName: raw.first_name,
      lastName: raw.last_name,
      profileImage: raw.profile_image,
    },
    countAdhesionFinished: raw.count_adhesion_finished,
    countAccountCreated: raw.count_account_created,
    countReported: raw.count_reported,
  })
)

export type ScoreboardReferrer = {
  adherent: Adherent
  countAdhesionFinished: number
  countAccountCreated: number
  countReported: number
}
