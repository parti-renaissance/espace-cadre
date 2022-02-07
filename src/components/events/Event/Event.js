import { Container, Grid } from '@mui/material'
import PageHeader from 'ui/PageHeader'
import KpiEvent from 'components/events/KPIEvent'
import { useInfiniteQueryWithScope, useQueryWithScope } from 'api/useQueryWithScope'
import { getEvent, getEventParticipants } from 'api/events'
import { useParams } from 'react-router'
import { getNextPageParam, usePaginatedData } from 'api/pagination'
import { useErrorHandler } from 'components/shared/error/hooks'
import InfiniteScroll from 'react-infinite-scroll-component'
import Loader from 'ui/Loader'
import UICard from 'ui/Card'
import Header from 'components/events/Event/card/Header'

const messages = {
  title: 'Événements > Pour une renaissance démocratique',
}

const Event = () => {
  const { eventId } = useParams()
  const { handleError } = useErrorHandler()

  const { data: event = null, isLoading } = useQueryWithScope(
    ['event', eventId, { feature: 'Events', view: 'Event' }],
    () => getEvent(eventId),
    {}
  )

  const {
    data: paginatedParticipants = null,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQueryWithScope(
    ['participants', eventId, { feature: 'Events', view: 'Event' }],
    () => getEventParticipants(eventId),
    {
      getNextPageParam,
      onError: handleError,
    }
  )

  const participants = usePaginatedData(paginatedParticipants)

  return (
    <Container maxWidth="lg" sx={{ mb: 3 }}>
      <Grid container justifyContent="space-between">
        <PageHeader title={messages.title} />
      </Grid>
      <KpiEvent participants={event?.participants} date={event?.beginAt} isLoading={isLoading} />
      <Grid container>
        <Grid item xs={12}>
          {paginatedParticipants && (
            <InfiniteScroll
              dataLength={participants.length}
              next={() => fetchNextPage()}
              hasMore={hasNextPage}
              loader={<Loader />}
            >
              <Grid container spacing={2}>
                {participants.map(p => (
                  <Grid item key={p.subscriptionDate + p.lastName} xs={12} sm={6} md={3}>
                    <UICard
                      rootProps={{ sx: { height: '110px', borderRadius: '8px' } }}
                      headerProps={{ sx: { pt: '21px' } }}
                      header={<Header participant={p} />}
                      actionsProps={{ sx: { pt: 1 } }}
                    />
                  </Grid>
                ))}
              </Grid>
            </InfiniteScroll>
          )}
        </Grid>
      </Grid>
    </Container>
  )
}

export default Event
