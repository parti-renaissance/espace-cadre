import { PaginatedApiQueryBaseModel, PaginatedDataModel } from '~/models/common.model'
import {
  AvailableProxyModel,
  ProcurationModel,
  ProcurationModelWithPersonalInfos,
} from '~/api/Procuration/procuration.model'
import { apiClient } from '~/services/networking/client'

export const ProcurationServiceKey = {
  request: 'procuration-request',
  singleRequest: 'procuration-request-single',
  availableProxies: 'procuration-available-proxies',
}

const base = 'v3/procuration/requests'

export const ProcurationService = {
  listRequests: ({ params, signal }: PaginatedApiQueryBaseModel): Promise<PaginatedDataModel<ProcurationModel>> =>
    apiClient.get(base, undefined, {
      params,
      signal,
    }),
  getRequest: ({ uuid }: { uuid: string }): Promise<ProcurationModelWithPersonalInfos> =>
    apiClient.get(`${base}/${uuid}`),
  getRequestAvailableProxies: ({
    params,
    signal,
    uuid,
  }: PaginatedApiQueryBaseModel & { uuid: string }): Promise<PaginatedDataModel<AvailableProxyModel>> =>
    apiClient.get(`${base}/${uuid}/proxies`, undefined, {
      params,
      signal,
    }),
  match: ({ uuid, proxy }: { uuid: string; proxy: string }) =>
    apiClient.post(`${base}/${uuid}/match`, {
      proxy,
    }),
  getProxies: ({ params, signal }: PaginatedApiQueryBaseModel): Promise<PaginatedDataModel<AvailableProxyModel>> =>
    apiClient.get('v3/procuration/proxies', undefined, {
      params,
      signal,
    }),
}
