import { useState } from 'react'
import {
  Container,
  Grid,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Box,
  Pagination,
  Drawer,
} from '@mui/material'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Lists from './Lists'
import Loader from 'ui/Loader'
import DynamicFilters from '../Filters/DynamicFilters'
import { exportActivists, getActivists } from 'api/activist'
import { PaginatedResult } from 'api/pagination'
import { useQueryWithScope } from 'api/useQueryWithScope'
import features from 'shared/features'
import EmptyContent from 'ui/EmptyContent'
import PageHeader from 'ui/PageHeader'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import Member from './Member'
import { useUserScope } from '../../redux/user/hooks'

const messages = {
  title: 'Militants',
}

const Activists = () => {
  const [defaultFilter, setDefaultFilter] = useState({ page: 1, zones: [] })
  const [filters, setFilters] = useState(defaultFilter)
  const [currentScope] = useUserScope()
  const [member, setMember] = useState(null)

  const { data: activists = new PaginatedResult([], 0, 0, 0, 0, 0), isLoading } = useQueryWithScope(
    ['activists', { feature: 'Activists', view: 'Activists' }, filters],
    () => {
      const filter = { ...filters, zones: filters.zones.map(z => z.uuid) }
      return getActivists(filter)
    }
  )

  const handleExport = () => {
    const filter = { ...filters, zones: filters.zones.map(z => z.uuid) }
    return exportActivists(filter)
  }

  const toggleDrawer = (e, member = null) => {
    e.preventDefault()
    setMember(member)
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
        <AccordionDetails sx={{ backgroundColor: 'colors.gray.50', pt: 2.5 }}>
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
        {isLoading && <Loader isCenter />}
        {activists.total > 0 ? (
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="body2" color="gray700" sx={{ flexShrink: 0 }}>
              Affichage de {activists.pageSize * (activists.currentPage - 1) + 1} à{' '}
              {activists.pageSize * (activists.currentPage - 1) + activists.currentPageCount} résultats sur{' '}
              {activists.total}
            </Typography>
            <Pagination
              sx={{ justifyContent: 'flex-end' }}
              count={activists.lastPage || 0}
              page={filters.page}
              onChange={(event, page) => setFilters(prevState => ({ ...prevState, page }))}
            />
          </Box>
        ) : (
          <EmptyContent description="Aucun résultat ne correspond à votre recherche" />
        )}

        <Lists members={activists.data} onMemberClick={toggleDrawer} />
      </Box>

      <Drawer anchor="right" open={member !== null} onClose={e => toggleDrawer(e, null)}>
        <Member member={member} handleClose={e => toggleDrawer(e, null)} />
      </Drawer>
    </Container>
  )
}

export default Activists
