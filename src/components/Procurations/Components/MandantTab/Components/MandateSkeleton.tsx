import { Grid } from '@mui/material'
import { withBottomSpacing } from '~/theme/spacing'
import SkeletonLine from '~/components/Skeleton/SkeletonLine'
import generateFixedArray from '~/utils/generateFixedArray'
import SkeletonCard from '~/components/Skeleton/SkeletonCard'
import { memo } from 'react'

function MandateSkeleton() {
  return (
    <>
      <Grid item xs={6} sx={withBottomSpacing}>
        <SkeletonLine />
      </Grid>

      {generateFixedArray(5).map((_, index) => (
        <SkeletonCard key={index.toString()} sx={withBottomSpacing} />
      ))}
    </>
  )
}

export default memo(MandateSkeleton)
