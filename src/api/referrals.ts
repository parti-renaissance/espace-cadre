import { apiClient } from '~/services/networking/client'
import { newPaginatedResult, PaginatedResult } from '~/api/pagination'
import { Referral, ReferralSchema } from '~/domain/referral'
import qs from 'qs'

export async function getReferrals(queryParams: {
  page: number
  referred?: string
  referrer?: string
}): Promise<PaginatedResult<Referral[]>> {
  const data = await apiClient.get('/v3/referrals?' + qs.stringify(queryParams))

  return newPaginatedResult<Referral[]>(
    data.items.map((raw: unknown) => ReferralSchema.parse(raw)),
    data.metadata
  )
}
