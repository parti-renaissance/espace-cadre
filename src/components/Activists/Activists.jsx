import { memo, useCallback, useState } from 'react'
import { Box, Card, Container, Drawer, Grid } from '@mui/material'
import PageHeader from '~/ui/PageHeader'
import Member from './Member/Member'
import { useUserScope } from '~/redux/user/hooks'
import ActivistList from '~/components/Activists/ActivistList'
import useGetActivists from '~/api/Activist/Hooks/useGetActivists'
import Activist from '~/domain/activist'
import LoadingButton from '@mui/lab/LoadingButton'
import useExportActivists from '~/api/Activist/Hooks/useExportActivists'
import { MuiSpacing } from '~/theme/spacing'
import ActivistFilters from '~/components/Activists/Components/ActivistFilters'
import { useDebounce } from '@uidotdev/usehooks'
import { FeatureEnum } from '~/models/feature.enum'

const messages = {
  title: 'Militants',
}

const MemoActivistList = memo(ActivistList)
const FiltersMemo = memo(ActivistFilters)

const Activists = () => {
  const [filters, setFilters] = useState(ActivistDefaultFilters)
  const debouncedFilters = useDebounce(filters, 400)

  const [currentScope] = useUserScope()
  const [member, setMember] = useState(null)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(25)

  const isElectFeatureEnabled = currentScope.hasFeature(FeatureEnum.ELECTED_REPRESENTATIVE)

  const { data: activists, isFetching } = useGetActivists({
    ...debouncedFilters,
    zones: debouncedFilters.zones.map(z => z.uuid),
    page,
    page_size: perPage,
  })

  const { mutate: exportActivists, isLoading: isExporting } = useExportActivists({
    ...filters,
    zones: filters.zones.map(z => z.uuid),
  })

  const handleDrawerClose = () => {
    setMember(null)
  }

  const onLineClick = useCallback(line => {
    setMember(
      new Activist(
        line.first_name,
        line.last_name,
        line.gender,
        line.country,
        line.city_code,
        line.city,
        line.committee,
        line.committee_uuid,
        line.postal_code,
        line.interests,
        line.email_subscription,
        line.last_membership_donation,
        line.created_at,
        line.adherent_uuid,
        line
      )
    )
  }, [])

  const resetPage = useCallback(() => {
    setPage(1)
  }, [])

  const onRowPerPageChange = useCallback(rowsPerPageParam => {
    setPerPage(rowsPerPageParam)
    setPage(1)
  }, [])

  return (
    <Container maxWidth={false} data-cy="contacts-container">
      <Grid container justifyContent="space-between">
        <PageHeader
          title={messages.title}
          button={
            currentScope.hasFeature(FeatureEnum.CONTACTS_EXPORT) && (
              <LoadingButton variant="contained" loading={isExporting} onClick={exportActivists}>
                Exporter
              </LoadingButton>
            )
          }
        />
      </Grid>

      <Box sx={{ mt: MuiSpacing.large }} className="space-y-4">
        <Card>
          <FiltersMemo resetPage={resetPage} filters={filters} setFilters={setFilters} />

          <Box sx={{ mt: MuiSpacing.large }} className="space-y-4">
            <MemoActivistList
              paginatedData={activists}
              page={page}
              onPageChange={setPage}
              perPage={perPage}
              onRowsPerPageChange={onRowPerPageChange}
              isLoading={isFetching}
              onLineClick={onLineClick}
            />
          </Box>

          <Drawer anchor="right" open={member !== null} onClose={handleDrawerClose}>
            <Member member={member} enableElectTab={isElectFeatureEnabled} handleClose={handleDrawerClose} />
          </Drawer>
        </Card>
      </Box>
    </Container>
  )
}

export const ActivistDefaultFilters = { page: 1, zones: [] }

export default Activists
