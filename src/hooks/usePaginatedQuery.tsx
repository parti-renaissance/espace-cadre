import { QueryFunction } from '@tanstack/query-core'
import { QueryKey, useInfiniteQuery } from '@tanstack/react-query'
import { PaginatedDataModel } from '~/models/common.model'
import { paginatedAccumulator, paginationHookParams } from '~/utils/paginationHookParams'
import { useMemo } from 'react'
import { uniqBy } from 'lodash'

interface Props<T> {
  queryFn: QueryFunction<PaginatedDataModel<T>>
  queryKey: QueryKey
  enabled?: boolean
  staleTime?: number
  cacheTime?: number
  onError?: (err: unknown) => void
  keepPreviousData?: boolean
}

/**
 * Simplify infinite query dialog, return as data aggregated array instead of pages array
 */
export default function usePaginatedQuery<T>({
  queryFn,
  queryKey,
  enabled,
  staleTime,
  cacheTime,
  onError,
  keepPreviousData,
}: Props<T>) {
  const query = useInfiniteQuery({
    queryFn,
    queryKey,
    enabled,
    staleTime,
    cacheTime,
    onError,
    keepPreviousData,
    ...paginationHookParams,
  })

  const virtualData: T[] = useMemo(() => {
    if (!query.data) {
      return []
    }

    return uniqBy(paginatedAccumulator(query.data) as T[], 'uuid')
  }, [query.data])

  return {
    ...query,
    aggregate: virtualData,
    total: query.data?.pages?.length && query.data?.pages?.length > 0 ? query.data?.pages[0].metadata.total_items : 0,
  }
}
