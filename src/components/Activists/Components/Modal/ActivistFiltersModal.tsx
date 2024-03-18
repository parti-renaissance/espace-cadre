import MinimalDialog from '~/mui/minimal-dialog/MinimalDialog'
import { FilterCategoryModel } from '~/models/filter.model'
import { Dispatch, SetStateAction } from 'react'
import SkeletonLine from '~/components/Skeleton/SkeletonLine'
import { Grid } from '@mui/material'
import { MuiSpacing } from '~/theme/spacing'
import DynamicFilters from '~/components/Filters/DynamicFilters'
import features from '~/shared/features'

interface Props {
  apiFilters: FilterCategoryModel[]
  onChange: Dispatch<SetStateAction<Record<string, unknown>>>
  values: Record<string, unknown>
  isLoading?: boolean
  isOpen?: boolean
  onClose?: () => void
}

export default function ActivistFiltersModal({ apiFilters, values, onChange, isLoading, isOpen, onClose }: Props) {
  return (
    <MinimalDialog open={isOpen ?? false} title={'Tous les filtres'} onClose={onClose}>
      <Grid sx={{ mx: MuiSpacing.normal, mb: MuiSpacing.normal }}>
        {isLoading ? (
          <Skeleton />
        ) : (
          <DynamicFilters
            apiFilters={apiFilters}
            fetchFilters={false}
            feature={features.contacts}
            values={values}
            onSubmit={onChange}
            onReset={() => {}}
          />
        )}
      </Grid>
    </MinimalDialog>
  )
}

const Skeleton = () => (
  <Grid>
    <SkeletonLine sx={{ mb: MuiSpacing.large }} />

    <Grid container spacing={MuiSpacing.small} sx={{ mb: MuiSpacing.large }}>
      <Grid item xs={12} md={6}>
        <SkeletonLine sx={{ mb: MuiSpacing.normal }} />
      </Grid>
      <Grid item xs={12} md={6}>
        <SkeletonLine sx={{ mb: MuiSpacing.normal }} />
      </Grid>
    </Grid>

    <SkeletonLine sx={{ mb: MuiSpacing.normal }} />

    <Grid container spacing={MuiSpacing.small} sx={{ mb: MuiSpacing.large }}>
      <Grid item xs={12} md={6}>
        <SkeletonLine sx={{ mb: MuiSpacing.normal }} />
      </Grid>
      <Grid item xs={12} md={6}>
        <SkeletonLine sx={{ mb: MuiSpacing.normal }} />
      </Grid>
      <Grid item xs={12} md={6}>
        <SkeletonLine sx={{ mb: MuiSpacing.normal }} />
      </Grid>
    </Grid>

    <Grid container spacing={MuiSpacing.small} sx={{ mb: MuiSpacing.large }}>
      <Grid item xs={12} md={6}>
        <SkeletonLine sx={{ mb: MuiSpacing.normal }} />
      </Grid>
      <Grid item xs={12} md={6}>
        <SkeletonLine sx={{ mb: MuiSpacing.normal }} />
      </Grid>
    </Grid>

    <SkeletonLine sx={{ mb: MuiSpacing.normal }} />
  </Grid>
)
