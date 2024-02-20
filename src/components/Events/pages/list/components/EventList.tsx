import InfiniteScroll from 'react-infinite-scroll-component'
import { Grid } from '@mui/material'
import { useInfiniteQueryWithScope } from '~/api/useQueryWithScope'
import { getNextPageParam, usePaginatedData } from '~/api/pagination'
import { useErrorHandler } from '~/components/shared/error/hooks'
import Loader from '~/ui/Loader'
import { generatePath, useNavigate } from 'react-router-dom'
import { paths } from '~/components/Events/shared/paths'
import CardEvent from '~/components/Events/pages/list/components/CardEvent'
import { forwardRef, useEffect, useImperativeHandle, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Event } from '~/components/Events/shared/types'

const messages = {
  deleteSuccess: "L'évènement a bien été supprimé",
  cancelSuccess: "L'évènement a bien été annulé",
  noEvent: 'Aucun évènement à afficher',
}

interface EventListProps {
  query: any
  queryKey: string
  ref: any
}

const EventList = forwardRef(({ query, queryKey }: EventListProps, ref) => {
  const { handleError } = useErrorHandler()
  const navigate = useNavigate()

  useImperativeHandle(ref, () => ({
    refetch: () => refetch(),
  }))

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

  const handleDelete = (event: Event) => {
    throw new Error('Not implemented')
  }

  const handleCancel = (event: Event) => {
    throw new Error('Not implemented')
  }

  return (
    <InfiniteScroll dataLength={events.length} next={() => fetchNextPage()} hasMore={!!hasNextPage} loader={<Loader />}>
      <Grid container spacing={4}>
        {events.map((e: any) => {
          const event = {
            ...e,
            category: categoryNameByCategoryId?.[e.categoryId] || '—',
          }

          return (
            <Grid item key={e.id} xs={12} sm={6} md={6} lg={4} xl={3}>
              <CardEvent
                event={event}
                onActionClick={(event, action) => {
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
                }}
              />
            </Grid>
          )
        })}
      </Grid>
    </InfiniteScroll>
  )
})

EventList.displayName = 'EventList'

export default EventList
