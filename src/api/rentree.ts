import qs from 'qs'
import { z } from 'zod'
import { apiClient } from '~/services/networking/client'
import { newPaginatedResult, PaginatedResult } from '~/api/pagination'
import { Inscription, InscriptionSchema } from '~/domain/meeting'
import { downloadFile } from '~/api/upload'

export async function getMeetingInscriptions(queryParams: { page: number }): Promise<PaginatedResult<Inscription[]>> {
  const data = await apiClient.get(
    '/v3/national_event_inscriptions?' + qs.stringify({ 'event.type': 'campus', ...queryParams })
  )

  return newPaginatedResult<Inscription[]>(z.array(InscriptionSchema).parse(data.items), data.metadata)
}

export const downloadInscriptions = () => downloadFile('/v3/national_event_inscriptions.xlsx')
