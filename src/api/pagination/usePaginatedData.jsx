import { useMemo } from 'react'

export default paginatedData => useMemo(() => paginatedData?.pages.flatMap(p => p.data) || [], [paginatedData])
