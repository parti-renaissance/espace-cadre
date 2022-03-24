import { useMemo } from 'react'

export default paginatedData =>
  useMemo(() => parseInt(paginatedData?.pages.flatMap(p => p.total).toString()) || 0, [paginatedData])
