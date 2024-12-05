import { MuiSpacing } from '~/theme/spacing'
import { Button, Grid } from '@mui/material'
import SkeletonLine from '~/components/Skeleton/SkeletonLine'
import FavoriteFilters from '~/components/Filters/FavoriteFilters'
import ActivistFiltersModal from '~/components/Activists/Components/Modal/ActivistFiltersModal'
import useApiFilters from '~/api/Filters/Hooks/useApiFilters'
import { FeatureEnum } from '~/models/feature.enum'
import { Dispatch, SetStateAction, useState } from 'react'
import { ActivistDefaultFilters } from '~/components/Activists/Activists'
import Iconify from '~/mui/iconify'

interface Props {
  filters: Record<string, unknown>
  setFilters: Dispatch<SetStateAction<Record<string, unknown>>>
  resetPage: () => void
}

export default function ActivistFilters({ filters, setFilters, resetPage }: Props) {
  const [filtersModalOpen, setFiltersModalOpen] = useState(false)

  const { data: apiFilters, isLoading: apiFiltersLoadings } = useApiFilters({
    feature: FeatureEnum.CONTACTS,
    extractFavorites: true,
  })

  const onModalChange = (v: SetStateAction<Record<string, unknown>>) => {
    setFilters(v)
    setFiltersModalOpen(false)
  }

  return (
    <>
      <Grid sx={{ mx: MuiSpacing.normal, mt: MuiSpacing.normal }}>
        <Grid container>
          <Grid item xs={6} sx={{ mb: MuiSpacing.normal }}>
            <Button
              variant={'outlined'}
              startIcon={<Iconify icon="ion:filter" />}
              onClick={() => setFiltersModalOpen(true)}
            >
              Filtres
            </Button>
          </Grid>

          {filters !== ActivistDefaultFilters && (
            <Grid item xs={6} textAlign={'end'}>
              <Button variant="outlined" onClick={() => setFilters(ActivistDefaultFilters)}>
                Réinitialiser les filtres
              </Button>
            </Grid>
          )}
        </Grid>

        {apiFiltersLoadings ? (
          <SkeletonLine />
        ) : (
          <FavoriteFilters
            apiFilters={apiFilters?.favorites ?? []}
            onChange={setFilters}
            values={filters}
            resetPage={resetPage}
          />
        )}
      </Grid>

      <ActivistFiltersModal
        apiFilters={apiFilters?.filters ?? []}
        onChange={onModalChange}
        values={filters}
        isOpen={filtersModalOpen}
        onClose={() => setFiltersModalOpen(false)}
      />
    </>
  )
}
