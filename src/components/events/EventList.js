import { useInfiniteQueryWithScope } from 'api/useQueryWithScope'
import { getNextPageParam, refetchUpdatedPage, usePaginatedData } from 'api/pagination'
import { useErrorHandler } from 'components/shared/error/hooks'
import { useMutation } from 'react-query'
import { notifyVariants } from 'components/shared/notification/constants'
import { cancelEvent as cancelEventQuery, deleteEvent as deleteEventQuery } from 'api/events'
import { Event } from 'domain/event'
import { generatePath, useNavigate } from 'react-router-dom'
import paths from 'shared/paths'
import InfiniteScroll from 'react-infinite-scroll-component'
import Loader from 'ui/Loader'
import { Grid } from '@mui/material'
import UICard from 'ui/Card'
import Header from 'components/events/card/Header'
import Actions from 'components/events/card/Actions'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { useSelector } from 'react-redux'
import { getCurrentUser } from '../../redux/user/selectors'
import PropTypes from 'prop-types'
import { useState } from 'react'

const messages = {
  deleteSuccess: "L'évènement a bien été supprimé",
  cancelSuccess: "L'évènement a bien été annulé",
}

const EventList = ({ query, queryKey }) => {
  const { handleError } = useErrorHandler()
  const { enqueueSnackbar } = useCustomSnackbar()
  const currentUser = useSelector(getCurrentUser)
  const [, setCurrentEvent] = useState(Event.NULL)
  const navigate = useNavigate()

  const {
    data: paginatedEvents = null,
    fetchNextPage,
    hasNextPage,
    refetch,
    isLoading,
    isError,
  } = useInfiniteQueryWithScope([queryKey, { feature: 'Events', view: 'Events' }], query, {
    getNextPageParam,
    onError: handleError,
  })

  const events = usePaginatedData(paginatedEvents)

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

  const handleViewEvent = uuid => () => {
    navigate(generatePath(`${paths.events}/:uuid`, { uuid }))
  }

  const handleEditEvent = id => () => {
    setCurrentEvent(events.find(e => e.id === id) || Event.NULL)
  }

  if (isLoading || isError) {
    return null
  }

  if (!events.length) return <div>Aucun évènement trouvé</div>

  return (
    <InfiniteScroll dataLength={events.length} next={() => fetchNextPage()} hasMore={hasNextPage} loader={<Loader />}>
      <Grid container spacing={2}>
        {events.map(e => (
          <Grid item key={e.id} xs={12} sm={6} md={3}>
            <UICard
              rootProps={{ sx: { height: '360px', borderRadius: '8px' } }}
              headerProps={{ sx: { pt: '21px' } }}
              header={<Header event={e} />}
              actionsProps={{ sx: { pt: 1 } }}
              actions={
                <Actions
                  onView={handleViewEvent(e.id)}
                  onEdit={handleEditEvent(e.id)}
                  onDelete={() => deleteEvent(e.id)}
                  isDeletable={e.attendees === 0 && e.organizerId === currentUser.uuid}
                  onCancel={() => cancelEvent(e.id)}
                  isCancelable={e.organizerId === currentUser.uuid}
                  loader={isLoadingDeleteEvent || isLoadingCancelEvent}
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
  query: PropTypes.func.isRequired,
  queryKey: PropTypes.string.isRequired,
}

export default EventList
