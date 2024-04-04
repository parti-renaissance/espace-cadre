import { Grid } from '@mui/material'
import { gridStandardLayout, withBottomSpacing } from '~/theme/spacing'
import SkeletonCard from '~/components/Skeleton/SkeletonCard'
import Page from '~/components/Page/Page'
import generateFixedArray from '~/utils/generateFixedArray'
import { Fragment } from 'react'
import SkeletonLine from '~/components/Skeleton/SkeletonLine'

export default function MandateMatchPageSkeleton() {
  return (
    <Page backButton>
      <Grid container spacing={2}>
        <Grid item {...gridStandardLayout.oneThird}>
          <SkeletonCard />
        </Grid>
        <Grid item {...gridStandardLayout.twoThirds}>
          {generateFixedArray(4).map((_, index) => (
            <Fragment key={index}>
              <SkeletonLine sx={withBottomSpacing} />
              <SkeletonCard sx={withBottomSpacing} />
            </Fragment>
          ))}
        </Grid>
      </Grid>
    </Page>
  )
}
