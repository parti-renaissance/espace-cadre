import { Grid } from '@mui/material'
import generateFixedArray from '~/utils/generateFixedArray'
import SkeletonCard from '~/components/Skeleton/SkeletonCard'
import { useMemo } from 'react'

export default function ActionsListSkeleton({ count }: { count: number }) {
  const data = useMemo(() => generateFixedArray(count), [count])

  return (
    <Grid container spacing={2}>
      {data.map((_, index) => (
        <Grid item key={index} xs={12} sm={6} md={4}>
          <SkeletonCard />
        </Grid>
      ))}
    </Grid>
  )
}
