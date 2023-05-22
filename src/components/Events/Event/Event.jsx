import { Container, Grid } from '@mui/material'
import PageHeader from 'ui/PageHeader'
import KpiEvent from 'components/Events/KPIEvent'
import { useInfiniteQueryWithScope, useQueryWithScope } from 'api/useQueryWithScope'

import { getEvent, getEventAttendees } from 'api/events'
import { useParams } from 'react-router'
import { getNextPageParam, usePaginatedData } from 'api/pagination'
import { useErrorHandler } from 'components/shared/error/hooks'
import InfiniteScroll from 'react-infinite-scroll-component'
import Loader from 'ui/Loader'
import UICard from 'ui/Card'
import Header from 'components/Events/Event/card/Header'
import paths from 'shared/paths'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import { useState } from 'react'
import CreateEditEvent from 'components/Events/CreateEditEvent'
import EditIcon from 'ui/icons/EditIcon'
import { useSelector } from 'react-redux'
import { getCurrentUser } from '../../../redux/user/selectors'

const messages = {
  events: 'Évènements',
  edit: 'Modifier',
}

const Event = () => {
  const { eventId } = useParams()
  const { handleError } = useErrorHandler()
  const currentUser = useSelector(getCurrentUser)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const {
    data: event = null,
    isLoading,
    refetch: refetchEvent,
  } = useQueryWithScope(['event', eventId, { feature: 'Events', view: 'Event' }], () => getEvent(eventId))

  const handleEdited = async () => await refetchEvent()

  const {
    data: paginatedAttendees = null,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQueryWithScope(
    ['paginated-attendees', eventId, { feature: 'Events', view: 'Event' }],
    () => getEventAttendees(eventId),
    {
      getNextPageParam,
      onError: handleError,
    }
  )

  const attendees = usePaginatedData(paginatedAttendees)

  return (
    <Container maxWidth={false} sx={{ mb: 3 }}>
      <Grid container justifyContent="space-between" sx={{ mb: 2 }}>
        <PageHeader
          title={messages.events}
          titleLink={paths.events}
          titleSuffix={event?.name}
          button={
            currentUser && event?.organizerId === currentUser.uuid && event?.scheduled ? (
              <PageHeaderButton
                onClick={() => setIsModalOpen(true)}
                label={messages.edit}
                icon={<EditIcon sx={{ color: 'campaign.color', fontSize: '20px' }} />}
                isMainButton
              />
            ) : null
          }
        />
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
              <Grid container spacing={3}>
                {attendees.map((attendee, index) => (
                  <Grid item key={index} xs={12} sm={6} md={3}>
                    <UICard
                      rootProps={{ sx: { height: '125px', borderRadius: '8px' } }}
                      headerProps={{ sx: { pt: 2.5 } }}
                      header={<Header attendee={attendee} />}
                      actionsProps={{ sx: { pt: 1 } }}
                    />
                  </Grid>
                ))}
              </Grid>
            </InfiniteScroll>
          )}
        </Grid>
      </Grid>
      {isModalOpen && (
        <CreateEditEvent
          handleClose={() => {
            setIsModalOpen(false)
          }}
          onUpdate={handleEdited}
          eventId={eventId}
        />
      )}
    </Container>
  )
}

export default Event
