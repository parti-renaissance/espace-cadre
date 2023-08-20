import { useState } from 'react'
import PropTypes from 'prop-types'
import { Container, Grid, Box, Badge, Typography, AccordionDetails, AccordionSummary, Accordion } from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Masonry from '@mui/lab/Masonry'
import { generatePath, useNavigate } from 'react-router'
import InfiniteScroll from 'react-infinite-scroll-component'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useInfiniteQueryWithScope } from 'api/useQueryWithScope'
import { getNextPageParam, usePaginatedData } from 'api/pagination'
import { getAllElected } from 'api/elected-representative'
import { useErrorHandler } from 'components/shared/error/hooks'
import Button from 'ui/Button'
import UICard, { UIChip } from 'ui/Card'
import Loader from 'ui/Loader'
import PageHeader from 'ui/PageHeader'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import EmptyContent from 'ui/EmptyContent'
import { mandates, functions } from 'shared/constants'
import features from 'shared/features'
import paths from 'shared/paths'
import DynamicFilters from '../Filters/DynamicFilters'
import CreateEditModal from './CreateEditModal'
import { Elected } from 'domain/elected_representative'

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
      label: 'Soumis au barème',
      color: 'teal700',
      bgcolor: 'activeLabel',
    },
    not_eligible: {
      label: 'Exonéré',
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
        borderColor: 'colors.gray.200',
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
    <Typography sx={{ fontSize: '14px', color: 'colors.gray.500' }}>{title}</Typography>
    {typeof content === 'string' ? (
      <Typography sx={{ fontSize: '14px', color: 'colors.gray.900' }} className="capitalize">
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
  const [elected, setElected] = useState(Elected.NULL)
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
    setElected(Elected.NULL)
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
            feature={features.elected_representative}
            values={defaultFilter}
            onSubmit={newFilters => setFilters({ ...newFilters, ...{ page: 1 } })}
            onReset={() => {
              setDefaultFilter(initialFilter)
              setFilters(initialFilter)
            }}
          />
        </AccordionDetails>
      </Accordion>

      {isLoading && <Loader isCenter />}

      {electedRepresentative && electedRepresentative.length === 0 && !isLoading && (
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
                  <Box key={elected.id} data-cy="elected-representative-card">
                    <UICard
                      rootProps={{ sx: { pt: 2 } }}
                      header={
                        <Box sx={{ display: 'flex', alignContent: 'center' }} className="elected-heading">
                          <h5 className="elected-heading__name">
                            {elected.firstName} <span>{elected.lastName}</span>
                          </h5>
                        </Box>
                      }
                      content={
                        <Box className="elected-content">
                          <Content title="Mandats Actifs" hasBadge={true} badge={elected.currentMandates.length}>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 0.5 }}>
                              {elected.currentMandates.map((mandat, index) => (
                                <span key={index} className="badge badge-default">
                                  {mandates[mandat.type]}
                                  {mandat.geo_zone && (
                                    <span> - {`${mandat.geo_zone.name} (${mandat.geo_zone.code})`}</span>
                                  )}
                                </span>
                              ))}
                            </Box>
                          </Content>
                          {elected.currentPoliticalFunctions.length > 0 && (
                            <Content sx={{ mt: 1, pt: 1.5 }} title="Fonctions politiques" hasBadge={false}>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 0.5 }}>
                                {elected.currentPoliticalFunctions.length > 0 &&
                                  elected.currentPoliticalFunctions.map((political_function, index) => (
                                    <span key={index} className="badge badge-default">
                                      {functions[political_function.name]}
                                    </span>
                                  ))}
                              </Box>
                            </Content>
                          )}
                          {elected.contributedAt && (
                            <Content sx={{ mt: 1, pt: 1.5 }} title="Cotisation">
                              <Raw
                                title="Statut:"
                                content={
                                  <UIChip
                                    {...(typeof messages.eligibility[elected.contributionStatus] !== 'undefined'
                                      ? messages.eligibility[elected.contributionStatus]
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
                                title="Déclaration faite le:"
                                content={format(elected.contributedAt, 'dd MMMM yyyy', {
                                  locale: fr,
                                })}
                              />
                              {elected.lastContribution && (
                                <>
                                  <Raw title="Moyen:" content={messages.type[elected.lastContribution.type]} />
                                  <Raw
                                    title="État de cotisation:"
                                    content={
                                      <UIChip
                                        {...messages.status[elected.lastContribution.status]}
                                        sx={{ height: 'auto', borderRadius: '8px' }}
                                      />
                                    }
                                    sx={{ display: 'none' }}
                                  />
                                  {elected.lastContribution.type === 'check' ||
                                  elected.lastContribution.type === 'cash' ? (
                                    <Raw
                                      title="Date de cotisation:"
                                      content={format(new Date(elected.lastContribution.start_date), 'dd MMMM yyyy', {
                                        locale: fr,
                                      })}
                                      sx={{ display: 'none' }}
                                    />
                                  ) : null}
                                </>
                              )}
                            </Content>
                          )}
                        </Box>
                      }
                      actions={
                        <Box sx={{ display: 'flex', mt: 2.5 }}>
                          <Button onClick={handleView(elected.id)} isMainButton>
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
