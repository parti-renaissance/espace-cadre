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
import MembersList from './MembersList'
import Loader from 'ui/Loader'
import DynamicFilters from '../Filters/DynamicFilters'
import { exportActivists, getActivists } from 'api/activist'
import { PaginatedResult } from 'api/pagination'
import { useQueryWithScope } from 'api/useQueryWithScope'
import features from 'shared/features'
import EmptyContent from 'ui/EmptyContent'
import PageHeader from 'ui/PageHeader'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import Member from './Member/Member'
import { useUserScope } from '../../redux/user/hooks'

const messages = {
  title: 'Militants',
}

const Activists = () => {
  const [defaultFilter, setDefaultFilter] = useState({ page: 1, zones: [] })
  const [filters, setFilters] = useState(defaultFilter)
  const [currentScope] = useUserScope()
  const [member, setMember] = useState(null)
  const [loader, setLoader] = useState(false)
  const [isShadowLoading, setIsShadowLoading] = useState(false)

  const {
    data: activists = new PaginatedResult([], 0, 0, 0, 0, 0),
    refetch,
    isFetching,
  } = useQueryWithScope(
    ['activists', { feature: 'Activists', view: 'Activists' }, filters],
    () => {
      const filter = { ...filters, zones: filters.zones.map(z => z.uuid) }
      return getActivists(filter)
    },
    { onSettled: () => setIsShadowLoading(false) }
  )

  const handleExport = async () => {
    setLoader(true)
    const filter = { ...filters, zones: filters.zones.map(z => z.uuid) }
    await exportActivists(filter)
    setLoader(false)
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

      <Box sx={{ mt: 4, position: 'relative' }} className="space-y-4">
        {(loader || (isFetching && !isShadowLoading)) && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
              zIndex: 1000,
              backgroundColor: 'rgba(255,255,255,0.5)',
            }}
          >
            <Loader isCenter />
          </Box>
        )}
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
          !isFetching && <EmptyContent description="Aucun résultat ne correspond à votre recherche" />
        )}

        <MembersList members={activists.data} onMemberClick={toggleDrawer} />
      </Box>

      <Drawer
        anchor="right"
        open={member !== null}
        onClose={e => {
          toggleDrawer(e, null)
          setIsShadowLoading(true)
          refetch()
        }}
      >
        <Member
          member={member}
          handleClose={e => {
            toggleDrawer(e, null)
            setIsShadowLoading(true)
            refetch()
          }}
        />
      </Drawer>
    </Container>
  )
}

export default Activists
