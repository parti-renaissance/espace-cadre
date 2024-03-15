import { useState } from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Box, Container, Drawer, Grid, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import DynamicFilters from '../Filters/DynamicFilters'
import features from '~/shared/features'
import PageHeader from '~/ui/PageHeader'
import Member from './Member/Member'
import { useUserScope } from '~/redux/user/hooks'
import ActivistList from '~/components/Activists/ActivistList'
import useGetActivists from '~/api/Activist/Hooks/useGetActivists'
import Activist from '~/domain/activist'
import LoadingButton from '@mui/lab/LoadingButton'
import useExportActivists from '~/api/Activist/Hooks/useExportActivists'

const messages = {
  title: 'Militants',
}

const Activists = () => {
  const [defaultFilter, setDefaultFilter] = useState({ page: 1, zones: [] })
  const [filters, setFilters] = useState(defaultFilter)
  const [currentScope] = useUserScope()
  const [member, setMember] = useState(null)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(100)

  const isElectFeatureEnabled = currentScope.hasFeature(features.elected_representative)

  const {
    data: activists,
    isFetching,
    refetch,
  } = useGetActivists({ ...filters, zones: filters.zones.map(z => z.uuid), page, itemsPerPage: perPage })

  const { mutate: exportActivists, isLoading: isExporting } = useExportActivists({
    ...filters,
    zones: filters.zones.map(z => z.uuid),
  })

  const handleDrawerClose = () => {
    setMember(null)
    if (isElectFeatureEnabled) {
      refetch()
    }
  }

  return (
    <Container maxWidth={false} data-cy="contacts-container">
      <Grid container justifyContent="space-between">
        <PageHeader
          title={messages.title}
          button={
            currentScope.hasFeature(features.contacts_export) && (
              <LoadingButton variant="contained" loading={isExporting} onClick={exportActivists}>
                Exporter
              </LoadingButton>
            )
          }
        />
      </Grid>

      <Accordion data-cy="accordion-filters-container">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel-filter-content"
          id="panel-filter-header"
          sx={{ backgroundColor: 'whiteCorner', borderTop: 'none' }}
        >
          <Typography>Appliquer des filtres</Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ backgroundColor: 'white', pt: 2.5 }}>
          <DynamicFilters
            feature={features.contacts}
            values={defaultFilter}
            onSubmit={newFilters => setFilters({ ...newFilters, ...{ page: 1 } })}
            onReset={() => {
              setDefaultFilter({ page: 1, zones: [] })
              setFilters({ page: 1, zones: [] })
            }}
          />
        </AccordionDetails>
      </Accordion>

      <Box sx={{ mt: 4 }} className="space-y-4">
        <ActivistList
          paginatedData={activists ?? []}
          page={page}
          onPageChange={setPage}
          perPage={perPage}
          onRowsPerPageChange={setPerPage}
          isLoading={isFetching}
          // Kept until #RE-1422 to be done.
          onLineClick={line =>
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
          }
        />
      </Box>

      <Drawer anchor="right" open={member !== null} onClose={handleDrawerClose}>
        <Member member={member} enableElectTab={isElectFeatureEnabled} handleClose={handleDrawerClose} />
      </Drawer>
    </Container>
  )
}

export default Activists
