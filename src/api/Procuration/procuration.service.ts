import { PaginatedDataModel } from '~/models/common.model'
import { ProcurationModel } from '~/api/Procuration/procuration.model'
import { apiClient } from '~/services/networking/client'

export const ProcurationServiceKey = {
  request: 'procuration-request',
}

export const ProcurationService = {
  listRequests: ({
    params,
    signal,
  }: {
    params: Record<string, unknown>
    signal?: AbortSignal
  }): Promise<PaginatedDataModel<ProcurationModel>> =>
    apiClient.get('v3/procuration/requests', undefined, {
      params,
      signal,
    }),
}
