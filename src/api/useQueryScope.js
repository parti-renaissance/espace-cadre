import { useUserScope } from '../redux/user/hooks'
import { useInfiniteQuery, useQuery } from 'react-query'

const scopedQueryKey = (queryKey, scope) => {
  const keys = Array.isArray(queryKey) ? queryKey : [queryKey]
  return keys.concat(scope.code)
}

export const useInfiniteQueryScope = (queryKey, queryFn, options) => {
  const [currentScope] = useUserScope()
  return useInfiniteQuery(scopedQueryKey(queryKey, currentScope), queryFn, options)
}

export const useQueryScope = (queryKey, queryFn, options) => {
  const [currentScope] = useUserScope()
  return useQuery(scopedQueryKey(queryKey, currentScope), queryFn, options)
}
