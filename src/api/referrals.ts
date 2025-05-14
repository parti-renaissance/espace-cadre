import qs from 'qs'
import { z } from 'zod'
import { apiClient } from '~/services/networking/client'
import { newPaginatedResult, PaginatedResult } from '~/api/pagination'
import { Referral, ReferralSchema, ScoreboardReferrer, ScoreboardReferrerSchema } from '~/domain/referral'

export async function getReferrals(queryParams: {
  page: number
  referred?: string
  referrer?: string
}): Promise<PaginatedResult<Referral[]>> {
  const data = await apiClient.get('/v3/referrals?' + qs.stringify(queryParams))

  return newPaginatedResult<Referral[]>(z.array(ReferralSchema).parse(data.items), data.metadata)
}

export async function getReferralsScoreboard(): Promise<ScoreboardReferrer[]> {
  const data = await apiClient.get('/v3/referrals/manager-scoreboard')

  return z.array(ScoreboardReferrerSchema).parse(data)
}
