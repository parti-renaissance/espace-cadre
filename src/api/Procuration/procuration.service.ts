import {
  AvailableProxyModel,
  ProcurationDetailsModel,
  ProcurationModel,
  ProcurationStatusEnum,
} from '~/api/Procuration/procuration.model'
import { PaginatedApiQueryBaseModel, PaginatedDataModel } from '~/models/common.model'
import { apiClient } from '~/services/networking/client'

export const ProcurationServiceKey = {
  request: 'procuration-request',
  singleRequest: 'procuration-request-single',
  availableProxies: 'procuration-available-proxies',
}

const base = 'v3/procuration/requests'
const proxyBase = 'v3/procuration/proxies'
const slotBase = 'v3/procuration/request_slots'
const proxySlotBase = 'v3/procuration/proxy_slots'

export const ProcurationService = {
  listRequests: ({ params, signal }: PaginatedApiQueryBaseModel): Promise<PaginatedDataModel<ProcurationModel>> =>
    apiClient.get(base, undefined, {
      params,
      signal,
    }),
  getRequest: ({ uuid }: { uuid: string }): Promise<ProcurationDetailsModel> => apiClient.get(`${base}/${uuid}`),
  getRequestAvailableProxies: ({
    params,
    signal,
    uuid,
  }: PaginatedApiQueryBaseModel & { uuid: string }): Promise<PaginatedDataModel<AvailableProxyModel>> =>
    apiClient.get(`${base}/${uuid}/proxies`, undefined, {
      params,
      signal,
    }),
  match: ({ uuid, proxy, emailCopy, round }: { uuid: string; proxy: string; emailCopy: boolean; round?: string }) =>
    apiClient.post(`${base}/${uuid}/match`, {
      proxy,
      round,
      email_copy: emailCopy,
    }),
  unmatch: ({ uuid, proxy, emailCopy, round }: { uuid: string; proxy: string; emailCopy: boolean; round?: string }) =>
    apiClient.post(`${base}/${uuid}/unmatch`, {
      proxy,
      round,
      email_copy: emailCopy,
    }),
  getProxies: ({ params, signal }: PaginatedApiQueryBaseModel): Promise<PaginatedDataModel<AvailableProxyModel>> =>
    apiClient.get(proxyBase, undefined, {
      params,
      signal,
    }),
  update: ({ uuid, status }: { uuid: string; status: ProcurationStatusEnum }) =>
    apiClient.patch(`${base}/${uuid}`, { status }),
  updateProxySlot: ({ uuid, payload }: { uuid: string; payload: { manual: boolean } }) =>
    apiClient.put(`${proxySlotBase}/${uuid}`, payload),

  updateRequestSlot: ({ uuid, payload }: { uuid: string; payload: { manual: boolean } }) =>
    apiClient.put(`${slotBase}/${uuid}`, payload),
  updateProxy: ({ uuid, status }: { uuid: string; status: ProcurationStatusEnum }) =>
    apiClient.patch(`${proxyBase}/${uuid}`, { status }),
}
