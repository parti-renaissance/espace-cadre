import { generatePath, useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { Card, CardContent, CardMedia, Box, Typography, IconButton, Button } from '@mui/material'
import Label from '~/mui/label'
import Iconify from '~/mui/iconify'
import { Stack } from '@mui/system'
import { getCurrentUser } from '~/redux/user/selectors'
import { usePopover } from '~/mui/custom-popover'
import { addressFormatted } from './helpers'
import BadgeStatus from './components/badgeStatus'
import ActionPopover from './components/actionPopOver'
import { Event } from '~/domain/event'
import type { Event as EventType } from '~/components/Events/shared/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notifyVariants } from '~/components/shared/notification/constants'
import { cancelEvent, deleteEvent as deleteEventQuery, cancelEvent as cancelEventQuery } from '~/api/events'
import { useCustomSnackbar } from '~/components/shared/notification/hooks'
import { useErrorHandler } from '~/components/shared/error/hooks'

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

const CardEvent = ({ event, refetchEvents }: CardEventProps) => {
  const { enqueueSnackbar } = useCustomSnackbar()
  const currentUser = useSelector(getCurrentUser)
  const { handleError } = useErrorHandler()
  const popover = usePopover()
  const navigate = useNavigate()
  const myEvent = event.organizerId === currentUser.uuid
  const queryClient = useQueryClient()

  const { mutate: deleteEvent } = useMutation(deleteEventQuery, {
    onSuccess: () => {
      enqueueSnackbar("L'événement a été supprimé avec succès", notifyVariants.success)

      popover.onClose()
      refetchEvents()
    },
    onError: handleError,
  })

  const { mutate: cancelEvent } = useMutation(deleteEventQuery, {
    onSuccess: () => {
      enqueueSnackbar("L'événement a été annulé avec succès", notifyVariants.success)

      popover.onClose()
      refetchEvents()
    },
    onError: handleError,
  })

  const handleDefineAction = (action: EventAction) => {
    switch (action) {
      case 'detail':
        navigate(generatePath('/evenements/:id', { id: event.id }))
        break
      case 'edit':
        navigate(generatePath('/evenements/modifier/:id', { id: event.id }))
        break
      case 'delete':
        deleteEvent(event.id)
        break
      case 'cancel':
        cancelEvent(event.id)
        break
    }
  }

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
      enabled: !!event?.category?.name,
      id: 'category',
      label: 'Catégorie',
      icon: 'solar:tag-horizontal-bold',
      children: (
        <Typography variant="caption" noWrap color="text.secondary">
          {event.category.name}
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

        <CardMedia
          component="img"
          sx={{ borderRadius: 1, height: 185, backgroundColor: 'gray300' }}
          src={event.image || 'https://i0.wp.com/nigoun.fr/wp-content/uploads/2022/04/placeholder.png?ssl=1'}
        />
      </Box>

      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
          <BadgeStatus beginAt={event.beginAt} finishAt={event.finishAt} scheduled={event.scheduled} />

          <Typography variant="caption" noWrap color="text.secondary">
            <Typography variant="caption" noWrap color="text.secondary">
              {new Date(event.beginAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
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
          {myEvent ? (
            <IconButton aria-label="actions" aria-describedby={event.id} onClick={event => popover.onOpen(event)}>
              <Iconify icon="eva:more-horizontal-fill" />
            </IconButton>
          ) : (
            <Button color="primary" onClick={() => handleDefineAction?.('detail')}>
              {"Voir l'événement"}
            </Button>
          )}

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

      <ActionPopover
        popover={popover}
        event={event as unknown as EventType}
        onClick={action => handleDefineAction?.(action)}
      />
    </Card>
  )
}

export default CardEvent
