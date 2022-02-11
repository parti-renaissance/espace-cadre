import { Container, Grid } from '@mui/material'
import PageHeader from 'ui/PageHeader'
import KpiEvent from 'components/events/KPIEvent'
import { useInfiniteQueryWithScope, useQueryWithScope } from 'api/useQueryWithScope'
import { getEvent, getEventAttendees } from 'api/events'
import { useParams } from 'react-router'
import { getNextPageParam, usePaginatedData } from 'api/pagination'
import { useErrorHandler } from 'components/shared/error/hooks'
import InfiniteScroll from 'react-infinite-scroll-component'
import Loader from 'ui/Loader'
import UICard from 'ui/Card'
import Header from 'components/events/Event/card/Header'
import paths from 'shared/paths'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import { useState } from 'react'
import CreateEditEvent from 'components/events/CreateEditEvent'


const messages = {
  events: 'Évènements',
  edit: 'Modifier',
}

const Event = () => {
  const [updatedEvent, setUpdatedEvent] = useState(null)
  const { eventId } = useParams()
  const { handleError } = useErrorHandler()

  const { data: event = null, isLoading } = useQueryWithScope(
    ['event', eventId, { feature: 'Events', view: 'Event' }],
    () => getEvent(eventId)
  )

  const handleEditEvent = () => {
    setUpdatedEvent(event)
  }

  const {
    data: paginatedAttendees = null,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQueryWithScope(
    ['attendees', eventId, { feature: 'Events', view: 'Event' }],
    () => getEventAttendees(eventId),
    {
      getNextPageParam,
      onError: handleError,
    }
  )

  const attendees = usePaginatedData(paginatedAttendees)

  return (
    <Container maxWidth="lg" sx={{ mb: 3 }}>
      <Grid container justifyContent="space-between">
        <PageHeader title={messages.events} titleLink={paths.events} titleSuffix={event?.name}
                    button={<PageHeaderButton onClick={handleEditEvent} label={messages.edit} />}/>

      </Grid>
      <KpiEvent attendees={event?.attendees} date={event?.beginAt} isLoading={isLoading} />
      <Grid container>
        <Grid item xs={12}>
          {paginatedAttendees && (
            <InfiniteScroll
              dataLength={attendees.length}
              next={() => fetchNextPage()}
              hasMore={hasNextPage}
              loader={<Loader />}
            >
              <Grid container spacing={2}>
                {attendees.map(a => (
                  <Grid item key={a.subscriptionDate + a.lastName} xs={12} sm={6} md={3}>
                    <UICard
                      rootProps={{ sx: { height: '110px', borderRadius: '8px' } }}
                      headerProps={{ sx: { pt: 2.5 } }}
                      header={<Header attendee={a} />}
                      actionsProps={{ sx: { pt: 1 } }}
                    />
                  </Grid>
                ))}
              </Grid>
            </InfiniteScroll>
          )}
        </Grid>
      </Grid>
      {updatedEvent && (
        <CreateEditEvent
          handleClose={() => {
            setUpdatedEvent(null)
          }}
          event={updatedEvent}
        />
      )}
    </Container>
  )
}

export default Event
