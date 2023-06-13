import { useMutation, useQueryClient } from '@tanstack/react-query'
import { generatePath, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useMemo } from 'react'
import { Grid } from '@mui/material'
import { cancelEvent as cancelEventQuery, deleteEvent as deleteEventQuery } from 'api/events'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useInfiniteQueryWithScope } from 'api/useQueryWithScope'
import { getNextPageParam, refetchUpdatedPage, usePaginatedData } from 'api/pagination'
import { notifyVariants } from 'components/shared/notification/constants'
import { useErrorHandler } from 'components/shared/error/hooks'
import Header from 'components/Events/card/Header'
import Actions from 'components/Events/card/Actions'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import Loader from 'ui/Loader'
import UICard from 'ui/Card'
import paths from 'shared/paths'

const messages = {
  deleteSuccess: "L'évènement a bien été supprimé",
  cancelSuccess: "L'évènement a bien été annulé",
  noEvent: 'Aucun évènement à afficher',
}

const EventList = ({ query, queryKey, setRefetchRef, onEdit, currentView }) => {
  const { handleError } = useErrorHandler()
  const { enqueueSnackbar } = useCustomSnackbar()
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

  useEffect(() => setRefetchRef(refetch), [refetch, setRefetchRef])

  const events = usePaginatedData(paginatedEvents)

  const queryClient = useQueryClient()
  const { data: categoriesByGroup = null } = queryClient.getQueryState([
    'categories',
    { feature: 'Events', view: 'Events' },
  ])
  const categoryNameByCategoryId = useMemo(
    () =>
      (categoriesByGroup?.flatMap(g => g.categories) || []).reduce(
        (map, group) => ({ ...map, [group.slug]: group.name }),
        {}
      ),
    [categoriesByGroup]
  )

  const { mutateAsync: deleteEvent, isLoading: isLoadingDeleteEvent } = useMutation(deleteEventQuery, {
    onSuccess: async () => {
      await refetch()
      enqueueSnackbar(messages.deleteSuccess, notifyVariants.success)
    },
    onError: handleError,
  })

  const { mutateAsync: cancelEvent, isLoading: isLoadingCancelEvent } = useMutation(cancelEventQuery, {
    onSuccess: async (_, updatedEvent) => {
      await refetchUpdatedPage(paginatedEvents, refetch, updatedEvent.id)
      enqueueSnackbar(messages.cancelSuccess, notifyVariants.success)
    },
    onError: handleError,
  })

  const handleCancel = useCallback(
    async id => {
      await cancelEvent(id)
      await refetch()
    },
    [cancelEvent, refetch]
  )

  const handleDelete = useCallback(
    async id => {
      await deleteEvent(id)
      await refetch()
    },
    [deleteEvent, refetch]
  )

  const handleViewEvent = uuid => () => {
    navigate(generatePath(`${paths.events}/:uuid`, { uuid }))
  }

  if (isLoading) {
    return <Loader isCenter />
  }
  if (!events.length) {
    return <div>{messages.noEvent}</div>
  }

  return (
    <InfiniteScroll dataLength={events.length} next={() => fetchNextPage()} hasMore={hasNextPage} loader={<Loader />}>
      <Grid container spacing={2}>
        {events.map(e => (
          <Grid item key={e.id} xs={12} sm={6} md={4} lg={3}>
            <UICard
              rootProps={{ sx: { height: '385px', borderRadius: '8px' } }}
              headerProps={{ sx: { pt: 2.5 } }}
              header={<Header event={e} categoryNameByCategoryId={categoryNameByCategoryId} />}
              actionsProps={{ sx: { pt: 1 } }}
              actions={
                <Actions
                  onView={handleViewEvent(e.id)}
                  onEdit={onEdit(e.id)}
                  isEditable={currentView === 'myEvents' && e.scheduled}
                  isCancelable={currentView === 'myEvents' && e.scheduled}
                  isDeletable={currentView === 'myEvents' && e.attendees <= 1}
                  onDelete={() => handleDelete(e.id)}
                  onCancel={() => handleCancel(e.id)}
                  deleteLoader={isLoadingDeleteEvent}
                  cancelLoader={isLoadingCancelEvent}
                />
              }
            />
          </Grid>
        ))}
      </Grid>
    </InfiniteScroll>
  )
}

EventList.propTypes = {
  onEdit: PropTypes.func.isRequired,
  query: PropTypes.func.isRequired,
  queryKey: PropTypes.string.isRequired,
  setRefetchRef: PropTypes.func.isRequired,
  currentView: PropTypes.string,
}

export default EventList
