import { Container, Grid } from '@mui/material'
import { useState } from 'react'
import { useParams } from 'react-router'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useSelector } from 'react-redux'

import { useInfiniteQueryWithScope, useQueryWithScope } from '~/api/useQueryWithScope'
import { getEvent, getEventAttendees } from '~/api/events'
import { getNextPageParam, usePaginatedData } from '~/api/pagination'
import { useErrorHandler } from '~/components/shared/error/hooks'
import KpiEvent from '~/components/Events/KPIEvent'
import Header from '~/components/Events/Event/card/Header'
import CreateEditEvent from '~/components/Events/CreateEditEvent'
import UICard, { CtaButton } from '~/ui/Card'
import Loader from '~/ui/Loader'
import PageHeader from '~/ui/PageHeader'
import { PageHeaderButton } from '~/ui/PageHeader/PageHeader'
import EditIcon from '~/ui/icons/EditIcon'
import paths from '~/shared/paths'
import { getCurrentUser } from '../../../redux/user/selectors'

const messages = {
  events: 'Évènements',
  edit: 'Modifier',
  see: 'Voir',
}

const Event = () => {
  const { eventId } = useParams()
  const { handleError } = useErrorHandler()
  const currentUser = useSelector(getCurrentUser)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const {
    data: event = null,
    isFetching,
    refetch: refetchEvent,
  } = useQueryWithScope(['event', eventId, { feature: 'Events', view: 'Event' }], () => getEvent(eventId))

  const handleEdited = async () => await refetchEvent()

  const {
    data: paginatedAttendees = null,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQueryWithScope(
    ['paginated-attendees', eventId, { feature: 'Events', view: 'Event' }],
    ({ pageParam: page = 1 }) => getEventAttendees(eventId, page),
    {
      getNextPageParam,
      onError: handleError,
    }
  )

  const attendees = usePaginatedData(paginatedAttendees)

  if (isFetching) {
    return <Loader />
  }

  return (
    <Container maxWidth={false} sx={{ mb: 3 }}>
      <Grid container justifyContent="space-between" sx={{ mb: 2 }}>
        <PageHeader
          title={messages.events}
          titleLink={paths.events}
          titleSuffix={event?.name}
          button={
            <>
              <CtaButton sx={{ mr: 1.5 }}>
                <a href={event.eventLink} target="_blank" rel="noreferrer">
                  {messages.see}
                </a>
              </CtaButton>

              {currentUser && event?.organizerId === currentUser.uuid && event?.scheduled ? (
                <PageHeaderButton
                  onClick={() => setIsModalOpen(true)}
                  label={messages.edit}
                  icon={<EditIcon sx={{ color: 'campaign.color', fontSize: '20px' }} />}
                  isMainButton
                />
              ) : null}
            </>
          }
        />
      </Grid>
      <KpiEvent attendees={event?.attendees} date={event?.beginAt} isLoading={false} />
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
