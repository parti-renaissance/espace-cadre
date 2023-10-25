import { useUserScope } from '../redux/user/hooks'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

const scopedQueryKey = (queryKey, scope) => {
  const keys = Array.isArray(queryKey) ? queryKey : [queryKey]
  return keys.concat(scope.code)
}

export const useInfiniteQueryWithScope = (queryKey, queryFn, options) => {
  const [currentScope] = useUserScope()
  return useInfiniteQuery({ queryKey: scopedQueryKey(queryKey, currentScope), queryFn, ...options })
}

export const useQueryWithScope = (queryKey, queryFn, options) => {
  const [currentScope] = useUserScope()
  return useQuery({ queryKey: scopedQueryKey(queryKey, currentScope), queryFn, ...options })
}
