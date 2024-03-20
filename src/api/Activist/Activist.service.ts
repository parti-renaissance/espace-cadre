import { apiClient } from '~/services/networking/client'
import qs from 'qs'
import { PaginatedDataModel } from '~/models/common.model'
import { ActivistModel } from '~/models/activist.model'

export const ActivistServiceKey = 'activists'

export const ActivistService = {
  get: async ({
    filters,
    signal,
  }: {
    filters: Record<string, unknown>
    signal?: AbortSignal
  }): Promise<PaginatedDataModel<ActivistModel>> =>
    await apiClient.get(`v3/adherents?${qs.stringify(filters)}`, {}, { signal }),
}
