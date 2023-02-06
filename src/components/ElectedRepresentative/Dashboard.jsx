import { Container, Grid } from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
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

const messages = {
  title: 'Registres des élus',
  create: 'Ajouter un élu',
  update: 'Modifier',
  noElected: "Vous n'avez aucun élu à afficher",
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
                  <Grid container spacing={2}>
                    {electedRepresentative.map(elected => (
                      <Grid item key={elected.uuid} xs={12} sm={6} md={3} lg={3} data-cy="elected-representative-card">
                        <UICard
                          rootProps={{ sx: { pt: 2 } }}
                          header={
                            <>
                              <span>Bonjour</span>
                            </>
                          }
                          content={
                            <>
                              <h5>Mon contenu</h5>
                            </>
                          }
                          actions={
                            <>
                              <button>Modifier</button>
                            </>
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
