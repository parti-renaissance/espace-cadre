import { useUserScope } from '../redux/user/hooks'
import { useInfiniteQuery, useQuery } from 'react-query'

const scopedQueryKey = (queryKey, scope) => {
  if (Array.isArray(queryKey)) {
    return queryKey.concat(scope.code)
  }
  return [scope.code].concat(queryKey)
}

export const useInfiniteQueryScope = (queryKey, queryFn, options) => {
  const [currentScope] = useUserScope()
  return useInfiniteQuery(scopedQueryKey(queryKey, currentScope), queryFn, options)
}

export const useQueryScope = (queryKey, queryFn, options) => {
  const [currentScope] = useUserScope()
  return useQuery(scopedQueryKey(queryKey, currentScope), queryFn, options)
}
