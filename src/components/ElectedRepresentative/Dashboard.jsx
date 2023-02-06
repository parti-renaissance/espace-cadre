import PropTypes from 'prop-types'
import { Container, Grid, Box, Badge } from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import ManIcon from '@mui/icons-material/Man'
import WomanIcon from '@mui/icons-material/Woman'
import InfiniteScroll from 'react-infinite-scroll-component'
import PageHeader from 'ui/PageHeader'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import { useErrorHandler } from 'components/shared/error/hooks'
import Loader from 'ui/Loader'
import UICard from 'ui/Card'
import EmptyContent from 'ui/EmptyContent'
import { useInfiniteQueryWithScope } from 'api/useQueryWithScope'
import { getNextPageParam, usePaginatedData } from 'api/pagination'
import { getElected } from 'api/elected-representative'
import { mandats, functions } from './mandats_functions'
import Button from 'ui/Button'

const messages = {
  title: 'Registres des élus',
  create: 'Ajouter un élu',
  update: 'Modifier',
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
        <Badge color="primary" badgeContent={badge} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <h6 className="elected-content__head pr-3">{title}</h6>
        </Badge>
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
  const { handleError } = useErrorHandler()

  const {
    data: paginatedElected = null,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQueryWithScope(
    ['paginated-elected-representative', { feature: 'ElectedRepresentative', view: 'Dashboard' }],
    getElected,
    {
      getNextPageParam,
      onError: handleError,
    }
  )

  const electedRepresentative = usePaginatedData(paginatedElected)

  return (
    <Container maxWidth={false} sx={{ mb: 3 }}>
      <>
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
          <>
            <Grid container justifyContent="space-between">
              <PageHeader
                title={messages.title}
                button={
                  <PageHeaderButton onClick={() => {}} label={messages.create} icon={<PersonAddIcon />} isMainButton />
                }
              />
            </Grid>
            <Grid container sx={{ pt: 4 }}>
              <Grid item xs={12}>
                <InfiniteScroll
                  dataLength={electedRepresentative.length}
                  next={() => fetchNextPage()}
                  hasMore={hasNextPage}
                  loader={<Loader />}
                >
                  <Grid container spacing={2.5} rowSpacing={3}>
                    {electedRepresentative.map(elected => (
                      <Grid item key={elected.uuid} xs={12} sm={6} md={3} lg={3} data-cy="elected-representative-card">
                        <UICard
                          rootProps={{ sx: { pt: 2 } }}
                          header={
                            <Box sx={{ display: 'flex', alignContent: 'center' }} className="elected-heading">
                              {elected.gender === 'male' ? (
                                <ManIcon sx={{ color: theme => theme.palette.colors.blue[300] }} fontSize="small" />
                              ) : (
                                <WomanIcon sx={{ color: theme => theme.palette.colors.pink }} fontSize="small" />
                              )}
                              <h5 className="elected-heading__name ml-1">
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
                                      {mandats[mandat.type]}
                                    </span>
                                  ))}
                                </Box>
                              </Content>
                              <Content
                                sx={{ mt: 1, pt: 1.5 }}
                                title="Fonctions politiques"
                                hasBadge={false}
                                badge={elected.current_mandates.length}
                              >
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 0.5 }}>
                                  {elected.current_political_functions.length > 0 &&
                                    elected.current_political_functions.map((political_functions, index) => (
                                      <span key={index} className="badge badge-default">
                                        {functions[political_functions.name]}
                                      </span>
                                    ))}

                                  {elected.current_political_functions.length === 0 && (
                                    <p className="empty-text">Ne possede aucune fonction politique</p>
                                  )}
                                </Box>
                              </Content>
                            </Box>
                          }
                          actions={
                            <Box sx={{ display: 'flex', mt: 2.5 }}>
                              <Button onClick={() => {}} isMainButton>
                                {messages.update}
                              </Button>
                            </Box>
                          }
                        />
                      </Grid>
                    ))}
                  </Grid>
                </InfiniteScroll>
              </Grid>
            </Grid>
          </>
        )}
      </>
    </Container>
  )
}

export default Dashboard
