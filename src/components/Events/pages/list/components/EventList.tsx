import InfiniteScroll from 'react-infinite-scroll-component'
import { Grid } from '@mui/material'
import { useScopedQueryKey } from '~/api/useQueryWithScope'
import { PaginatedResult, getNextPageParam, usePaginatedData } from '~/api/pagination'
import { useErrorHandler } from '~/components/shared/error/hooks'
import Loader from '~/ui/Loader'
import { generatePath, useNavigate } from 'react-router-dom'
import { paths } from '~/components/Events/shared/paths'
import CardEvent from '~/components/Events/pages/list/components/CardEvent'
import { forwardRef, useImperativeHandle, useMemo } from 'react'
import { useQueryClient, QueryKey, UseInfiniteQueryResult, useInfiniteQuery } from '@tanstack/react-query'
import { Event } from '~/components/Events/shared/types'
import { EventCategory, EventGroupCategory } from '~/domain/event'

const messages = {
  deleteSuccess: "L'évènement a bien été supprimé",
  cancelSuccess: "L'évènement a bien été annulé",
  noEvent: 'Aucun évènement à afficher',
}

type EventAction = 'detail' | 'edit' | 'delete' | 'cancel'

interface EventListProps {
  query: () => Promise<PaginatedResult<Event[]>>
  queryKey: QueryKey
}

export interface EventListRef {
  refetch: UseInfiniteQueryResult<PaginatedResult<Event[]>>['refetch']
}

const EventList = forwardRef<EventListRef, EventListProps>(({ query, queryKey }, ref) => {
  const { handleError } = useErrorHandler()
  const navigate = useNavigate()
  const queryKeyScoped = useScopedQueryKey(queryKey)

  const {
    data: paginatedEvents,
    fetchNextPage,
    hasNextPage,
    refetch,
    isLoading,
  } = useInfiniteQuery([queryKeyScoped, { feature: 'Events', view: 'Events' }], query, {
    getNextPageParam,
    onError: handleError,
  })

  useImperativeHandle(ref, () => ({ refetch }))

  const categoryByGroup = useQueryClient().getQueryState<EventGroupCategory[]>([
    'categories',
    { feature: 'Events', view: 'Events' },
  ])

  const categoryNameByCategoryId = useMemo(
    () =>
      (categoryByGroup?.data?.flatMap(g => g.categories as EventCategory[]) || []).reduce(
        (map, group) => ({ ...map, [group.slug]: group.name }),
        {} as Record<EventCategory['slug'], EventCategory['name']>
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

  const handleDelete = (event: Event) => {
    throw new Error('Not implemented')
  }

  const handleCancel = (event: Event) => {
    throw new Error('Not implemented')
  }

  const handleDefineAction = (event: Event, action: EventAction) => {
    switch (action) {
      case 'detail':
        navigate(generatePath(`${paths.events}/:uuid`, { uuid: event.id }))
        break
      case 'edit':
        navigate(generatePath(`${paths.events}/edit/:uuid`, { uuid: event.id }))
        break
      case 'delete':
        handleDelete(event)
        break
      case 'cancel':
        handleCancel(event)
        break
    }
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
        {events.map((e: any) => {
          const event = {
            ...e,
            category: categoryNameByCategoryId?.[e.categoryId] || '—',
          }

          return (
            <Grid item key={e.id} xs={12} sm={6} md={6} lg={4} xl={3}>
              <CardEvent event={event} onActionClick={(event, action) => handleDefineAction(event, action)} />
            </Grid>
          )
        })}
      </Grid>
    </InfiniteScroll>
  )
})

EventList.displayName = 'EventList'

export default EventList
