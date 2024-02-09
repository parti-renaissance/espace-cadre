import { QueryKey, useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useUserScope } from '../redux/user/hooks'
import type { Scope } from '~/domain/scope'

export const scopedQueryKey = (queryKey: QueryKey, scope: Scope): QueryKey => {
  const keys = Array.isArray(queryKey) ? queryKey : [queryKey]
  return keys.concat(scope.code)
}
export const useScopedQueryKey = (queryKey: QueryKey): QueryKey => {
  const [currentScope] = useUserScope()
  return scopedQueryKey(queryKey, currentScope as Scope)
}

export const useInfiniteQueryWithScope = (...[queryKey, queryFn, options]: Parameters<typeof useInfiniteQuery>) => {
  const scopedQueryKey = useScopedQueryKey(queryKey)
  return useInfiniteQuery(scopedQueryKey, queryFn, options)
}

export const useQueryWithScope = (...[queryKey, queryFn, options]: Parameters<typeof useQuery>) => {
  const scopedQueryKey = useScopedQueryKey(queryKey)
  return useQuery(scopedQueryKey, queryFn, options)
}
