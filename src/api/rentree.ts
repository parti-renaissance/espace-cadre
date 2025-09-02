import qs from 'qs'
import { z } from 'zod'
import { apiClient } from '~/services/networking/client'
import { newPaginatedResult, PaginatedResult } from '~/api/pagination'
import { Inscription, InscriptionSchema } from '~/domain/meeting'
import { downloadFile } from '~/api/upload'
import { ListFilter } from '~/components/Rentree/List'

export async function getMeetingInscriptions(queryParams: ListFilter): Promise<PaginatedResult<Inscription[]>> {
  const data = await apiClient.get(
    '/v3/national_event_inscriptions?' + qs.stringify({ 'event.type': 'campus', ...queryParams }, { skipNulls: true })
  )

  return newPaginatedResult<Inscription[]>(z.array(InscriptionSchema).parse(data.items), data.metadata)
}

export const downloadInscriptions = (filters: ListFilter) =>
  downloadFile('/v3/national_event_inscriptions.xlsx?' + qs.stringify(filters, { skipNulls: true }))
