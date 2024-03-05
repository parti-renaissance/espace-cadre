import InfiniteScroll from 'react-infinite-scroll-component'
import { Grid } from '@mui/material'
import { useScopedQueryKey } from '~/api/useQueryWithScope'
import { PaginatedResult, getNextPageParam, usePaginatedData } from '~/api/pagination'
import { useErrorHandler } from '~/components/shared/error/hooks'
import Loader from '~/ui/Loader'
import CardEvent from '~/components/Events/pages/list/components/CardEvent'
import { QueryKey, useInfiniteQuery } from '@tanstack/react-query'
import { Event } from '~/domain/event'

const messages = {
  deleteSuccess: "L'événement a bien été supprimé",
  cancelSuccess: "L'événement a bien été annulé",
  noEvent: 'Aucun événement à afficher',
}

interface EventListProps {
  query: () => Promise<PaginatedResult<Event[]>>
  queryKey: QueryKey
}

const EventList = ({ query, queryKey }: EventListProps) => {
  const { handleError } = useErrorHandler()
  const queryKeyScoped = useScopedQueryKey(queryKey)

  const {
    data: paginatedEvents,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useInfiniteQuery([queryKeyScoped, { feature: 'Events', view: 'Events' }], query, {
    getNextPageParam,
    onError: handleError,
  })

  const events = usePaginatedData(paginatedEvents)

  if (isLoading) {
    return <Loader isCenter />
  }

  if (!events.length) {
    return <div>{messages.noEvent}</div>
  }

  return (
    <InfiniteScroll
      dataLength={events.length}
      next={() => fetchNextPage()}
      hasMore={!!hasNextPage}
      loader={<Loader />}
      style={{ overflow: 'visible' }}
    >
      <Grid container spacing={4}>
        {events.map((event: any, index: number) => (
          <Grid item key={index} xs={12} sm={6} md={6} lg={4} xl={3}>
            <CardEvent event={event} />
          </Grid>
        ))}
      </Grid>
    </InfiniteScroll>
  )
}

export default EventList
