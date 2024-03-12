import { useState } from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Box, Container, Drawer, Grid, Typography } from '@mui/material'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import DynamicFilters from '../Filters/DynamicFilters'
import { exportActivists } from '~/api/activist'
import features from '~/shared/features'
import PageHeader from '~/ui/PageHeader'
import { PageHeaderButton } from '~/ui/PageHeader/PageHeader'
import Member from './Member/Member'
import { useUserScope } from '~/redux/user/hooks'
import ActivistList from '~/components/Activists/ActivistList'
import useGetActivists from '~/api/Activist/Hooks/useGetActivists'

const messages = {
  title: 'Militants',
}

const Activists = () => {
  const [defaultFilter, setDefaultFilter] = useState({ page: 1, zones: [] })
  const [filters, setFilters] = useState(defaultFilter)
  const [currentScope] = useUserScope()
  const [member, setMember] = useState(null)
  const [loader, setLoader] = useState(false)
  // const { handleError } = useErrorHandler()
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(25)

  const isElectFeatureEnabled = currentScope.hasFeature(features.elected_representative)

  const {
    data: activists,
    isFetching,
    refetch,
  } = useGetActivists({ ...filters, zones: filters.zones.map(z => z.uuid), page, page_size: perPage })

  const handleExport = async () => {
    setLoader(true)
    const filter = { ...filters, zones: filters.zones.map(z => z.uuid) }
    await exportActivists(filter)
    setLoader(false)
  }

  const handleDrawerClose = () => {
    setMember(null)
    if (isElectFeatureEnabled) {
      // setIsShadowLoading(true)
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
              <PageHeaderButton onClick={handleExport} label="Exporter" icon={<FileDownloadIcon />} isMainButton />
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
        />
      </Box>

      <Drawer anchor="right" open={member !== null} onClose={handleDrawerClose}>
        <Member member={member} enableElectTab={isElectFeatureEnabled} handleClose={handleDrawerClose} />
      </Drawer>
    </Container>
  )
}

export default Activists
