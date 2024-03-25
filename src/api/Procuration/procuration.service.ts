import { PaginatedDataModel } from '~/models/common.model'
import { ProcurationModel, ProcurationModelWithPersonalInfos } from '~/api/Procuration/procuration.model'
import { apiClient } from '~/services/networking/client'

export const ProcurationServiceKey = {
  request: 'procuration-request',
  singleRequest: 'procuration-request-single',
}

const base = 'v3/procuration/requests'

export const ProcurationService = {
  listRequests: ({
    params,
    signal,
  }: {
    params: Record<string, unknown>
    signal?: AbortSignal
  }): Promise<PaginatedDataModel<ProcurationModel>> =>
    apiClient.get(base, undefined, {
      params,
      signal,
    }),
  getRequest: ({ id }: { id: string }): Promise<ProcurationModelWithPersonalInfos> => apiClient.get(`${base}/${id}`),
}
