import { MuiSpacing } from '~/theme/spacing'
import { Box, Button } from '@mui/material'
import { Icon } from '@iconify/react'
import SkeletonLine from '~/components/Skeleton/SkeletonLine'
import FavoriteFilters from '~/components/Filters/FavoriteFilters'
import ActivistFiltersModal from '~/components/Activists/Components/Modal/ActivistFiltersModal'
import useApiFilters from '~/api/Filters/Hooks/useApiFilters'
import { FeatureEnum } from '~/models/feature.enum'
import { Dispatch, SetStateAction, useCallback, useState } from 'react'

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

  const onModalChange = useCallback(
    (v: SetStateAction<Record<string, unknown>>) => {
      setFilters(v)
      setFiltersModalOpen(false)
    },
    [setFilters]
  )

  return (
    <>
      <Box sx={{ mx: MuiSpacing.normal, mt: MuiSpacing.normal }}>
        <Box sx={{ mb: MuiSpacing.normal }}>
          <Button variant="text" startIcon={<Icon icon="ion:filter" />} onClick={() => setFiltersModalOpen(true)}>
            Filtres
          </Button>
        </Box>

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
      </Box>

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
