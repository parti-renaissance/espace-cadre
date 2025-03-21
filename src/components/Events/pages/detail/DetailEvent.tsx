import { Box, Button, Card, Container, Grid, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import BadgeStatus from '~/components/Events/pages/list/components/CardEvent/components/badgeStatus'
import ListInformations from '~/components/Events/pages/detail/components/ListInformations'
import { ShareLink } from '~/components/Events/pages/detail/components'
import Iconify from '~/mui/iconify'
import { useNavigate } from 'react-router-dom'
import { paths } from '~/components/Events/shared/paths'
import { format } from 'date-fns'
import Loader from '~/ui/Loader'
import { useQueryWithScope } from '~/api/useQueryWithScope'
import { getEvent } from '~/api/events'
import { Event } from '~/domain/event'
import { useParams } from 'react-router'
import Attendees from '~/components/Events/pages/detail/components/Attendees'
import EventImage from '~/components/Events/Components/EventImage'

const DetailEvent = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()

  const { data, isFetching } = useQueryWithScope(['event', eventId, { feature: 'Events', view: 'Event' }], () =>
    getEvent(eventId)
  )

  const event = data as Event

  if (isFetching) {
    return <Loader />
  }

  if (!event) {
    return <Typography variant="h4">Événement introuvable</Typography>
  }

  return (
    <Container maxWidth="xl">
      <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center" marginBottom={'28px'}>
        <Button startIcon={<Iconify icon="eva:arrow-ios-back-fill" />} onClick={() => navigate(paths.events)}>
          Retour
        </Button>

        {event.editable ? (
          <Button
            variant="contained"
            startIcon={<Iconify icon="solar:pen-bold" />}
            onClick={() => {
              navigate(`/${paths.events}/${paths.update}/${eventId}`)
            }}
          >
            Modifier
          </Button>
        ) : null}
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={12} lg={8} xl={8}>
          <Card sx={{ display: 'flex' }}>
            <Stack direction="column" spacing={2} width="100%" sx={{ p: '24px' }}>
              <EventImage image={event.image} sx={{ width: '100%', borderRadius: '8px' }} />

              <Box sx={{ flex: '1 0 auto' }}>
                <Stack direction="column" spacing={4}>
                  <Stack direction="column" spacing={2}>
                    <Typography variant="h4">{event.name}</Typography>
                    <Typography variant="caption" color="text.primary">
                      {event.editable && event.category
                        ? `Mes événements / ${event.category.name}`
                        : event.category.name}
                    </Typography>

                    <Stack direction="row" spacing={2} alignItems="center">
                      <BadgeStatus
                        beginAt={event.localBeginAt}
                        finishAt={event.localFinishAt}
                        scheduled={event.scheduled}
                      />
                    </Stack>
                  </Stack>

                  <Stack direction="column" spacing={2}>
                    <Typography variant="h6">Description</Typography>

                    <div
                      className="tiptap_html"
                      dangerouslySetInnerHTML={{
                        __html: event.description,
                      }}
                    ></div>
                  </Stack>

                  {event.createdAt && (
                    <Box>
                      <Typography variant="body1" color="text.secondary" component="div" fontSize={14}>
                        Date de création : {format(new Date(event.createdAt), 'dd/MM/yyyy à HH:mm')}
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

            {event.organizer && (
              <Card>
                <Stack direction="column" spacing={1} padding={'24px'}>
                  <Typography variant="body2">Événement créé par :</Typography>
                  <Typography variant="subtitle2">{event.organizer}</Typography>
                </Stack>
              </Card>
            )}
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
