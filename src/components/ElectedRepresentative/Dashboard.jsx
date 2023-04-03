import { useState } from 'react'
import PropTypes from 'prop-types'
import { Container, Grid, Box, Badge, Typography } from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import Masonry from '@mui/lab/Masonry'
import { generatePath, useNavigate } from 'react-router'
import InfiniteScroll from 'react-infinite-scroll-component'
import PageHeader from 'ui/PageHeader'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import { useErrorHandler } from 'components/shared/error/hooks'
import Loader from 'ui/Loader'
import UICard, { UIChip } from 'ui/Card'
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
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const messages = {
  title: 'Registre des élus',
  create: 'Ajouter un élu',
  update: 'Modifier',
  view: 'Voir',
  noElected: "Vous n'avez aucun élu à afficher",
  status: {
    active: {
      label: 'Actif',
      color: 'teal700',
      bgcolor: 'activeLabel',
    },
    pending_submission: {
      label: 'En attente',
      color: 'yellow800',
      bgcolor: 'pendingLabel',
    },
    inactive: {
      label: 'Inactif',
      color: 'red600',
      bgcolor: 'inactiveLabel',
    },
  },
  type: {
    mandate: 'prélèvement',
    check: 'chèque',
    transfer: 'virement',
  },
  eligibility: {
    eligible: {
      label: 'Éligible',
      color: 'teal700',
      bgcolor: 'activeLabel',
    },
    not_eligible: {
      label: 'Inéligible',
      color: 'yellow800',
      bgcolor: 'pendingLabel',
    },
  },
}

const Content = ({ sx, title, subtitle, hasBadge, badge, children }) => (
  <Box sx={sx}>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
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
      {subtitle}
    </Box>
    {children}
  </Box>
)

Content.propTypes = {
  sx: PropTypes.object,
  title: PropTypes.string,
  subtitle: PropTypes.node,
  hasBadge: PropTypes.bool,
  badge: PropTypes.number,
  children: PropTypes.node,
}

const Raw = ({ title, content, sx = {} }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, ...sx }} className="space-x-2">
    <Typography sx={{ fontSize: '14px', color: theme => theme.palette.colors.gray[500] }}>{title}</Typography>
    {typeof content === 'string' ? (
      <Typography sx={{ fontSize: '14px', color: theme => theme.palette.colors.gray[900] }} className="capitalize">
        {content}
      </Typography>
    ) : (
      content
    )}
  </Box>
)

Raw.propTypes = {
  title: PropTypes.string,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  sx: PropTypes.object,
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
    <Container maxWidth={false} sx={{ mb: 3 }} data-cy="elected-representative-container">
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
              <PageHeaderButton label={messages.create} onClick={handleOpen} icon={<PersonAddIcon />} isMainButton />
            </>
          }
        />
      )}

      {electedRepresentative && electedRepresentative.length > 0 && (
        <Grid container sx={{ mt: 4 }} data-cy="elected-representative-grid">
          <Grid item xs={12}>
            <InfiniteScroll
              dataLength={electedRepresentative.length}
              next={() => fetchNextPage()}
              hasMore={hasNextPage}
              loader={<Loader />}
            >
              <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2.5}>
                {electedRepresentative.map(elected => (
                  <Box key={elected.uuid} data-cy="elected-representative-card">
                    <UICard
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
                          {elected.contributed_at && (
                            <Content sx={{ mt: 1, pt: 1.5 }} title="Cotisation">
                              <Raw
                                title="Éligibilité:"
                                content={
                                  <UIChip
                                    {...(typeof messages.eligibility[elected.contribution_status] !== 'undefined'
                                      ? messages.eligibility[elected.contribution_status]
                                      : {
                                          label: 'Indisponible',
                                          color: 'colors.gray.800',
                                          bgcolor: 'colors.gray.100',
                                        })}
                                    labelStyle={{ fontSize: '13px' }}
                                  />
                                }
                              />
                              <Raw
                                title="Date:"
                                content={format(new Date(elected.contributed_at), 'dd MMMM yyyy', {
                                  locale: fr,
                                })}
                              />
                              <Raw title="Moyen:" content={messages.type[elected.last_contribution.type]} />
                              <Raw
                                title="Status:"
                                content={
                                  <UIChip
                                    {...messages.status[elected.last_contribution.status]}
                                    sx={{ height: 'auto', borderRadius: '8px' }}
                                  />
                                }
                                sx={{ display: 'none' }}
                              />
                              {elected.last_contribution.type === 'check' ||
                              elected.last_contribution.type === 'cash' ? (
                                <Raw
                                  title="Date de cotisation:"
                                  content={format(new Date(elected.last_contribution.start_date), 'dd MMMM yyyy', {
                                    locale: fr,
                                  })}
                                  sx={{ display: 'none' }}
                                />
                              ) : null}
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
                  </Box>
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
