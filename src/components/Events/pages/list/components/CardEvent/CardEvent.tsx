import { generatePath, useNavigate } from 'react-router'
import { Card, CardContent, Box, Typography, Button } from '@mui/material'
import Label from '~/mui/label'
import Iconify from '~/mui/iconify'
import { Stack } from '@mui/system'
import { addressFormatted } from './helpers'
import BadgeStatus from './components/badgeStatus'
import { Event } from '~/domain/event'
import EventImage from '~/components/Events/Components/EventImage'

export type EventAction = 'detail' | 'edit' | 'delete' | 'cancel'

type ListItem = {
  enabled: boolean
  id: string
  label: string
  icon: string
  children: string | JSX.Element | null
}

type CardEventProps = {
  event: Event
  refetchEvents: () => void
}

const CardEvent = ({ event }: CardEventProps) => {
  const navigate = useNavigate()

  const listItems: ListItem[] = [
    {
      enabled: !!event?.organizer && !!event?.organizerId,
      id: 'organizer',
      label: 'Organisateur',
      icon: 'solar:user-rounded-bold',
      children: (
        <Typography variant="caption" noWrap color="text.secondary">
          Par{' '}
          <Typography variant="caption" component="span" color="text.primary">
            {event.organizer}
          </Typography>
        </Typography>
      ),
    },
    {
      enabled: !!event.address && !event.visioUrl,
      id: 'address',
      label: 'Adresse',
      icon: 'solar:flag-bold',
      children: (
        <Typography variant="caption" noWrap color="text.secondary">
          {addressFormatted(event.address)}
        </Typography>
      ),
    },
    {
      enabled: !!event.visioUrl,
      id: 'visioUrl',
      label: 'Visioconférence',
      icon: 'solar:monitor-camera-bold',
      children: (
        <Typography variant="caption" noWrap color="text.secondary">
          Visio-conférence
        </Typography>
      ),
    },
    {
      enabled: !!event?.category,
      id: 'category',
      label: 'Catégorie',
      icon: 'solar:tag-horizontal-bold',
      children: (
        <Typography variant="caption" noWrap color="text.secondary">
          {event.category?.name}
        </Typography>
      ),
    },
  ]

  return (
    <Card data-cy="ui-card">
      <Box padding={1}>
        {event.visioUrl && (
          <Label
            variant="filled"
            color="default"
            startIcon={<Iconify icon="solar:videocamera-record-bold" />}
            sx={{
              position: 'absolute',
              marginTop: 1,
              marginRight: 2,
              right: 0,
              fontWeight: 500,
            }}
          >
            Visio
          </Label>
        )}

        <EventImage sx={{ borderRadius: 1, height: '185px', backgroundColor: 'gray300' }} image={event.image} />
      </Box>

      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
          <BadgeStatus beginAt={event.localBeginAt} finishAt={event.localFinishAt} scheduled={event.scheduled} />

          <Typography variant="caption" noWrap color="text.secondary">
            <Typography variant="caption" noWrap color="text.secondary">
              {new Date(event.localBeginAt).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
          </Typography>
        </Box>

        <Stack>
          <Typography variant="subtitle2" noWrap color={'text.primary'}>
            {event.name}
          </Typography>
        </Stack>

        {listItems
          .map(
            item =>
              item.enabled && (
                <Stack key={item.id} direction="row" spacing={1} alignItems="center" marginTop={1}>
                  <Iconify icon={item.icon} color="text.disabled" />
                  {typeof item.children === 'string' ? (
                    <Typography variant="caption" noWrap color="text.disabled">
                      {item.children}
                    </Typography>
                  ) : (
                    item.children
                  )}
                </Stack>
              )
          )
          .filter(Boolean)}

        <Box display="flex" justifyContent="space-between" alignItems="center" marginTop={2} data-cy="dot-action-menu">
          <Button color="primary" onClick={() => navigate(generatePath('/evenements/:id', { id: event.id }))}>
            Voir l&apos;événement
          </Button>

          <Stack display="flex" direction="row" spacing={1} alignItems="center">
            {event?.attendees > 0 && (
              <Stack direction="row" spacing={0.5} alignItems="center" marginTop={1}>
                <Iconify icon={'solar:users-group-rounded-bold'} color="text.disabled" />
                <Typography variant="caption" noWrap color="text.disabled">
                  {event.attendees}
                </Typography>
              </Stack>
            )}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  )
}

export default CardEvent
