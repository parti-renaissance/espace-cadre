import { Grid, Card, CardMedia, Box, Typography, Container, Button } from '@mui/material'
import { Stack } from '@mui/system'
import BadgeStatus from '~/components/Events/pages/list/components/CardEvent/components/badgeStatus'
import ListInformations from '~/components/Events/pages/detail/components/ListInformations'
import { ShareLink } from '~/components/Events/pages/detail/components'
import Iconify from '~/mui/iconify'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { paths } from '~/components/Events/shared/paths'
import { useErrorHandler } from '~/components/shared/error/hooks'
import { format } from 'date-fns'
import { useSelector } from 'react-redux'
import { getCurrentUser } from '~/redux/user/selectors'
import Loader from '~/ui/Loader'
import { useInfiniteQueryWithScope, useQueryWithScope } from '~/api/useQueryWithScope'
import { getEvent } from '~/api/events'
import { useParams } from 'react-router'
import { Event } from '~/components/Events/shared/types'
import Attendees from '~/components/Events/pages/detail/components/Attendees'

const DetailEvent = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const { handleError } = useErrorHandler()
  const currentUser = useSelector(getCurrentUser)

  const {
    data,
    isFetching,
    refetch: refetchEvent,
  } = useQueryWithScope(['event', eventId, { feature: 'Events', view: 'Event' }], () => getEvent(eventId))

  const event = data as Event

  if (isFetching) {
    return <Loader />
  }

  if (!event) {
    return <Typography variant="h4">Événement introuvable</Typography>
  }

  const myEvent = event.organizerId === currentUser.uuid

  return (
    <Container maxWidth="xl">
      <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center" marginBottom={'28px'}>
        <Button startIcon={<Iconify icon="eva:arrow-ios-back-fill" />} onClick={() => navigate(paths.events)}>
          Retour
        </Button>

        {myEvent ? (
          <Button
            variant="contained"
            startIcon={<Iconify icon="solar:pen-bold" />}
            onClick={() => {
              throw new Error('Not implemented')
            }}
          >
            Modifier
          </Button>
        ) : (
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-circle-fill" />}
            onClick={() => {
              throw new Error('Not implemented')
            }}
          >
            Inviter mes militants
          </Button>
        )}
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={12} lg={8} xl={8}>
          <Card sx={{ display: 'flex' }}>
            <Stack direction="column" spacing={2} width="100%" sx={{ p: '24px' }}>
              <CardMedia
                component="img"
                image={event.image || 'https://i0.wp.com/nigoun.fr/wp-content/uploads/2022/04/placeholder.png?ssl=1'}
                sx={{ width: '100%', height: '295px', borderRadius: '8px' }}
              />

              <Box sx={{ flex: '1 0 auto' }}>
                <Stack direction="column" spacing={4}>
                  <Stack direction="column" spacing={2}>
                    <Typography variant="h4">{event.name}</Typography>
                    <Typography variant="caption" color="text.primary">
                      {myEvent && event.categoryId ? `Mes événements / ${event.categoryId}` : event.category}
                    </Typography>

                    <Stack direction="row" spacing={2} alignItems="center">
                      <BadgeStatus event={event} />
                    </Stack>
                  </Stack>

                  <Stack direction="column" spacing={2}>
                    <Typography variant="h6">Description</Typography>

                    <Typography variant="body1" component="div">
                      {event.description}
                    </Typography>
                  </Stack>

                  {event.createdAt && (
                    <Box>
                      <Typography variant="body1" color="text.secondary" component="div" fontSize={14}>
                        Date de création : {format(event.createdAt, 'dd MMMM yyyy')}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Box>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
          <Stack direction="column" spacing={2}>
            <ListInformations event={event} />

            {event.visioUrl && <ShareLink link={event.visioUrl} />}

            <Card>
              <Stack direction="column" spacing={1} padding={'24px'}>
                <Typography variant="body2">Événement créer par :</Typography>
                <Typography variant="subtitle2">{event?.organizer}</Typography>
              </Stack>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      <Box
        sx={{
          height: '1px',
          width: '100%',
          backgroundColor: 'grey.300',
          marginY: '2em',
        }}
      />

      <Attendees />
    </Container>
  )
}

export default DetailEvent
