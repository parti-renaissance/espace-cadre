import { useState } from 'react'
import { Event } from 'domain/event'
import { useCustomSnackbar } from 'components/shared/notification/hooks'
import { useErrorHandler } from 'components/shared/error/hooks'
import { useInfiniteQueryWithScope } from 'api/useQueryWithScope'
import { getNextPageParam, refetchUpdatedPage, usePaginatedData } from 'api/pagination'
import { Container, Grid } from '@mui/material'
import PageHeader from 'ui/PageHeader'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import InfiniteScroll from 'react-infinite-scroll-component'
import Loader from 'ui/Loader'
import UICard from 'ui/Card'
import Header from './card/Header'
import Actions from './card/Actions'
import { deleteEvent as deleteEventQuery, cancelEvent as cancelEventQuery, getEvents } from 'api/events'
import { useMutation } from 'react-query'
import { notifyVariants } from 'components/shared/notification/constants'
import { useSelector } from 'react-redux'
import { getCurrentUser } from '../../redux/user/selectors'
import { generatePath, useNavigate } from 'react-router-dom'
import paths from 'shared/paths'

const messages = {
  title: 'Évènements',
  create: 'Nouvel évènement',
  deleteSuccess: "L'évènement a bien été supprimé",
  cancelSuccess: "L'évènement a bien été annulé",
}

const Events = () => {
  const [, setCurrentEvent] = useState(Event.NULL)
  const { enqueueSnackbar } = useCustomSnackbar()
  const { handleError } = useErrorHandler()
  const currentUser = useSelector(getCurrentUser)
  const navigate = useNavigate()

  const {
    data: paginatedEvents = null,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQueryWithScope(['events', { feature: 'Events', view: 'Events' }], getEvents, {
    getNextPageParam,
    onError: handleError,
  })

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

  const events = usePaginatedData(paginatedEvents)

  const handleCreateEvent = () => {
    setCurrentEvent(Event.NULL)
  }

  const handleViewEvent = uuid => () => {
    navigate(generatePath(`${paths.events}/:uuid`, { uuid }))
  }

  const handleEditEvent = id => () => {
    setCurrentEvent(events.find(e => e.id === id) || Event.NULL)
  }

  return (
    <Container maxWidth="lg" sx={{ mb: 3 }}>
      <Grid container justifyContent="space-between">
        <PageHeader
          title={messages.title}
          button={<PageHeaderButton onClick={handleCreateEvent} label={messages.create} />}
        />
      </Grid>
      {paginatedEvents && (
        <InfiniteScroll
          dataLength={events.length}
          next={() => fetchNextPage()}
          hasMore={hasNextPage}
          loader={<Loader />}
        >
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
      )}
    </Container>
  )
}

export default Events
