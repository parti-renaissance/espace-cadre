import { useMemo } from 'react'
import PaginatedResult from './paginatedResult'
import { InfiniteData } from '@tanstack/react-query'

export default <Data>(paginatedData?: InfiniteData<PaginatedResult<Data>>) =>
  useMemo(() => paginatedData?.pages.flatMap(p => p.data) || [], [paginatedData])
