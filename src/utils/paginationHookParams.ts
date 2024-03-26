import { PaginatedDataModel } from '~/models/common.model'
import { InfiniteData } from '@tanstack/react-query'

/**
 * Get standard pagination parameters and parser for infinite query
 */
export const paginationHookParams = {
  getNextPageParam: <T>(lastPage: PaginatedDataModel<T>) =>
    lastPage.metadata.current_page >= lastPage.metadata.last_page ? undefined : lastPage.metadata.current_page + 1,
  getPreviousPageParam: (lastPage: any) =>
    lastPage.metadata.current_page <= lastPage.metadata.last_page ? undefined : lastPage.metadata.current_page - 1,
}

/**
 * Generate on array from useQuery's infinite queries
 * @param data
 */
export function paginatedAccumulator<T>(data: InfiniteData<PaginatedDataModel<T>>): T[] {
  return data.pages
    .flat()
    .map(({ items }) => items)
    .flat()
}
