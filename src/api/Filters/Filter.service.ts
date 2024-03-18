import { apiClient } from '~/services/networking/client'
import { FeatureEnum } from '~/models/feature.enum'
import { FilterCategoryModel, FilterModel } from '~/models/filter.model'

export const FilterServiceKey = 'api-filter'

export const FilterService = {
  get: async (
    feature: FeatureEnum,
    extractFavorites = false
  ): Promise<{
    filters: FilterCategoryModel[]
    favorites?: FilterModel[]
  }> => {
    const getFilters = (): Promise<FilterCategoryModel[]> => apiClient.get(`/v3/filters?feature=${feature}`)

    const filters = await getFilters()
    const favorites: FilterModel[] = []

    if (extractFavorites) {
      for (const category of filters) {
        for (const filter of category.filters) {
          if (filter.options && 'favorite' in filter.options) {
            favorites.push(filter)
          }
        }
      }
    }

    return {
      filters,
      favorites,
    }
  },
}
