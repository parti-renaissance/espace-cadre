import { ActionAPIEditModel, ActionAPIFormModel, ActionAPIModel } from '~/models/actions.model'
import { apiClient } from '~/services/networking/client'
import { PaginatedApiQueryBaseModel, PaginatedDataModel } from '~/models/common.model'

export const ActionsServiceKey = 'activists'
const base = 'v3/actions'

export const ActionsService = {
  create: async (data: ActionAPIFormModel): Promise<ActionAPIModel> => await apiClient.post(base, data),
  update: async (data: ActionAPIEditModel): Promise<ActionAPIModel> => await apiClient.put(base, data),
  list: async ({ params, signal }: PaginatedApiQueryBaseModel): Promise<PaginatedDataModel<ActionAPIModel>> => {
    return import('../../../cypress/fixtures/actions/actions.json') as Promise<PaginatedDataModel<ActionAPIModel>>
    // await apiClient.get(base, {}, { signal, params })
  },
}
