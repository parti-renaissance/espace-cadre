import InfiniteScroll from 'react-infinite-scroll-component'
import { Grid } from '@mui/material'
import { useInfiniteQueryWithScope } from '~/api/useQueryWithScope'
import { getNextPageParam, usePaginatedData } from '~/api/pagination'
import { useErrorHandler } from '~/components/shared/error/hooks'
import Loader from '~/ui/Loader'
import { generatePath, useNavigate } from 'react-router-dom'
import { paths } from '~/components/Events/shared/paths'
import CardEvent from '~/components/Events/pages/list/components/CardEvent'
import { useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'

const messages = {
  deleteSuccess: "L'évènement a bien été supprimé",
  cancelSuccess: "L'évènement a bien été annulé",
  noEvent: 'Aucun évènement à afficher',
}

interface EventListProps {
  query: any
  queryKey: string
}

const EventList = ({ query, queryKey }: EventListProps) => {
  const { handleError } = useErrorHandler()
  const navigate = useNavigate()

  const {
    data: paginatedEvents = null,
    fetchNextPage,
    hasNextPage,
    refetch,
    isLoading,
  } = useInfiniteQueryWithScope([queryKey, { feature: 'Events', view: 'Events' }], query, {
    getNextPageParam,
    onError: handleError,
  })

  const categoryByGroup = useQueryClient().getQueryState(['categories', { feature: 'Events', view: 'Events' }])
  const categoryNameByCategoryId = useMemo(
    () =>
      ((categoryByGroup?.data as any)?.flatMap((g: any) => g.categories) || []).reduce(
        (map: any, group: any) => ({ ...map, [group.slug]: group.name }),
        {}
      ),
    [categoryByGroup]
  )

  const events = usePaginatedData(paginatedEvents)

  if (isLoading) {
    return <Loader isCenter />
  }

  if (!events.length) {
    return <div>{messages.noEvent}</div>
  }

  const handleViewEvent = uuid => () => {
    navigate(generatePath(`${paths.events}/:uuid`, { uuid }))
  }

  return (
    <InfiniteScroll dataLength={events.length} next={() => fetchNextPage()} hasMore={false} loader={<Loader />}>
      <Grid container spacing={4}>
        {events.map((e: any) => {
          const event = {
            ...e,
            category: categoryNameByCategoryId?.[e.categoryId] || '—',
          }

          console.log(event)

          return (
            <Grid item key={e.id} xs={12} sm={6} md={6} lg={4} xl={3}>
              <CardEvent
                event={event}
                onActionClick={(event, action) => {
                  console.log('onActionClick', action)
                }}
              />
            </Grid>
          )
        })}
      </Grid>
    </InfiniteScroll>
  )
}

export default EventList
