import * as React from 'react'
import { Link } from 'react-router-dom'
import { generatePath } from 'react-router'
import { useSelector } from 'react-redux'
import { Card, CardContent, CardMedia, Box, Typography, IconButton, Button } from '@mui/material'
import Label from '~/mui/label'
import Iconify from '~/mui/iconify'
import { Stack } from '@mui/system'
import { Event } from '~/components/Events/shared/types'
import { getCurrentUser } from '~/redux/user/selectors'
import { usePopover } from '~/mui/custom-popover'

import BadgeStatus from './components/badgeStatus'
import { addressFormatted, dateFormatted } from './helpers'
import ActionPopover from './components/actionPopOver'

export type CardEventAction = 'detail' | 'edit' | 'delete' | 'cancel'

type CardEventProps = {
  event: Event
  onActionClick?: (event: Event, action: CardEventAction) => any
}

const CardEvent = ({ event, onActionClick }: CardEventProps) => {
  const currentUser = useSelector(getCurrentUser)
  const popover = usePopover()
  const myEvent = event.organizerId === currentUser.uuid

  const listItems = [
    {
      enabled: event.organizer.length > 0 && !!event.organizerId,
      id: 'organizer',
      label: 'Organisateur',
      icon: 'solar:user-rounded-bold',
      children: (
        <Typography variant="caption" noWrap color="text.secondary">
          Par{' '}
          <Typography variant="caption" component="span" color="text.primary">
            <Link to={generatePath('/organizer/:id', { id: event.organizerId })}>{event.organizer}</Link>
          </Typography>
        </Typography>
      ),
    },
    {
      enabled: !!event.address,
      id: 'address',
      label: 'Adresse',
      icon: 'solar:flag-bold',
      children: addressFormatted(event.address),
    },
    {
      enabled: !!event.category,
      id: 'category',
      label: 'Catégorie',
      icon: 'solar:tag-horizontal-bold',
      children: event.category,
    },
  ]

  return (
    <Card>
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
          src="https://i0.wp.com/nigoun.fr/wp-content/uploads/2022/04/placeholder.png?ssl=1"
        />
      </Box>

      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
          <BadgeStatus event={event} />

          <Typography variant="caption" noWrap color="text.secondary">
            {dateFormatted(event.beginAt)}
          </Typography>
        </Box>

        <Stack>
          <Typography variant="subtitle2" noWrap color={'text.primary'}>
            {/*{event.name}*/}
          </Typography>

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

        <Box display="flex" justifyContent="space-between" alignItems="center" marginTop={2}>
          {myEvent ? (
            <IconButton aria-label="actions" aria-describedby={event.id} onClick={event => popover.onOpen(event)}>
              <Iconify icon="eva:more-horizontal-fill" />
            </IconButton>
          ) : (
            <Button
              color="primary"
              onClick={() => {
                onActionClick?.(event, 'detail')
              }}
            >
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

      <ActionPopover popover={popover} event={event} onClick={(event, action) => onActionClick?.(event, action)} />
    </Card>
  )
}

export default CardEvent
