import { useState } from 'react'
import PropTypes from 'prop-types'
import { Container, Grid, Box, Badge } from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import Masonry from '@mui/lab/Masonry'
import { generatePath, useNavigate } from 'react-router'
import InfiniteScroll from 'react-infinite-scroll-component'
import PageHeader from 'ui/PageHeader'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import { useErrorHandler } from 'components/shared/error/hooks'
import Loader from 'ui/Loader'
import UICard from 'ui/Card'
import EmptyContent from 'ui/EmptyContent'
import DynamicFilters from '../Filters/DynamicFilters'
import { useInfiniteQueryWithScope } from 'api/useQueryWithScope'
import { getNextPageParam, usePaginatedData } from 'api/pagination'
import { getAllElected } from 'api/elected-representative'
import { mandats, functions } from 'shared/constants'
import Button from 'ui/Button'
import CreateEditModal from './CreateEditModal'
import features from 'shared/features'
import paths from 'shared/paths'

const messages = {
  title: 'Registre des élus',
  create: 'Ajouter un élu',
  update: 'Modifier',
  view: 'Voir',
  noElected: "Vous n'avez aucun élu à afficher",
}

const Content = ({ sx, title, hasBadge, badge, children }) => (
  <Box sx={sx}>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        borderTop: '1px solid',
        borderColor: theme => theme.palette.colors.gray[200],
        pt: 1.5,
      }}
    >
      {hasBadge ? (
        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1 }}>
          <Badge color="primary" badgeContent={badge} anchorOrigin={{ vertical: 'top', horizontal: 'left' }} />
          <h6 className="elected-content__head pl-4">{title}</h6>
        </Box>
      ) : (
        <h6 className="elected-content__head">{title}</h6>
      )}
    </Box>
    {children}
  </Box>
)

Content.propTypes = {
  sx: PropTypes.object,
  title: PropTypes.string,
  hasBadge: PropTypes.bool,
  badge: PropTypes.number,
  children: PropTypes.node,
}

const Dashboard = () => {
  const initialFilter = {
    page: 1,
    zones: [],
    mandates: [],
    political_functions: [],
    renaissance_membership: 'adherent_re',
  }
  const [defaultFilter, setDefaultFilter] = useState(initialFilter)
  const [filters, setFilters] = useState(defaultFilter)
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false)
  const [elected, setElected] = useState(null)
  const { handleError } = useErrorHandler()
  const navigate = useNavigate()

  const {
    data: paginatedElected = null,
    fetchNextPage,
    hasNextPage,
    isLoading,
    refetch: refetchElectedRepresentative,
  } = useInfiniteQueryWithScope(
    ['paginated-elected-representative', { feature: 'ElectedRepresentative', view: 'Dashboard' }, filters],
    ({ pageParam: page = 1 }) => {
      const filter = { ...filters, page, zones: filters.zones.map(z => z.uuid) }
      return getAllElected(filter)
    },
    {
      getNextPageParam,
      onError: handleError,
    }
  )

  const handleOpen = () => {
    setIsCreateEditModalOpen(true)
  }

  const handleClose = () => {
    setElected(null)
    setIsCreateEditModalOpen(false)
  }

  const handleView = electedId => () => {
    navigate(generatePath(`${paths.elected_representative}/:electedId`, { electedId }))
  }

  const electedRepresentative = usePaginatedData(paginatedElected)

  return (
    <Container maxWidth={false} sx={{ mb: 3 }}>
      <Grid container justifyContent="space-between">
        <PageHeader
          title={messages.title}
          button={
            <PageHeaderButton onClick={handleOpen} label={messages.create} icon={<PersonAddIcon />} isMainButton />
          }
        />
      </Grid>
      <DynamicFilters
        feature={features.elected_representative}
        values={defaultFilter}
        onSubmit={newFilters => setFilters({ ...newFilters, ...{ page: 1 } })}
        onReset={() => {
          setDefaultFilter(initialFilter)
          setFilters(initialFilter)
        }}
      />

      {isLoading && <Loader />}

      {electedRepresentative && electedRepresentative.length === 0 && (
        <EmptyContent
          description={messages.noElected}
          action={
            <>
              <PageHeaderButton label={messages.create} onClick={() => {}} icon={<PersonAddIcon />} isMainButton />
            </>
          }
        />
      )}

      {electedRepresentative && electedRepresentative.length > 0 && (
        <Grid container sx={{ mt: 4 }}>
          <Grid item xs={12}>
            <InfiniteScroll
              dataLength={electedRepresentative.length}
              next={() => fetchNextPage()}
              hasMore={hasNextPage}
              loader={<Loader />}
            >
              <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2.5}>
                {electedRepresentative.map(elected => (
                  <UICard
                    key={elected.uuid}
                    rootProps={{ sx: { pt: 2 } }}
                    header={
                      <Box sx={{ display: 'flex', alignContent: 'center' }} className="elected-heading">
                        <h5 className="elected-heading__name">
                          {elected.first_name} <span>{elected.last_name}</span>
                        </h5>
                      </Box>
                    }
                    content={
                      <Box className="elected-content">
                        <Content title="Mandats Actifs" hasBadge={true} badge={elected.current_mandates.length}>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 0.5 }}>
                            {elected.current_mandates.map((mandat, index) => (
                              <span key={index} className="badge badge-default">
                                {mandats[mandat.type]} -{' '}
                                <span>{`${mandat.geo_zone.name} (${mandat.geo_zone.code})`}</span>
                              </span>
                            ))}
                          </Box>
                        </Content>
                        {elected.current_political_functions.length > 0 && (
                          <Content sx={{ mt: 1, pt: 1.5 }} title="Fonctions politiques" hasBadge={false}>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 0.5 }}>
                              {elected.current_political_functions.length > 0 &&
                                elected.current_political_functions.map((political_functions, index) => (
                                  <span key={index} className="badge badge-default">
                                    {functions[political_functions.name]}
                                  </span>
                                ))}
                            </Box>
                          </Content>
                        )}
                      </Box>
                    }
                    actions={
                      <Box sx={{ display: 'flex', mt: 2.5 }}>
                        <Button onClick={handleView(elected.uuid)} isMainButton>
                          {messages.view}
                        </Button>
                      </Box>
                    }
                  />
                ))}
              </Masonry>
            </InfiniteScroll>
          </Grid>
        </Grid>
      )}

      {isCreateEditModalOpen && (
        <CreateEditModal elected={elected} handleClose={handleClose} onCreateResolve={refetchElectedRepresentative} />
      )}
    </Container>
  )
}

export default Dashboard
