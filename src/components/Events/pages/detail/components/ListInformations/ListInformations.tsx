import React from 'react'
import { Card, Link, List, ListItem, ListItemAvatar, Typography } from '@mui/material'
import { Box, Stack } from '@mui/system'
import Iconify from '~/mui/iconify'
import { Event } from '~/domain/event'
import { format, isSameDay } from 'date-fns'
import { Link as RouterLink } from 'react-router-dom'
import { getTimezoneOffsetLabel } from '~/shared/helpers'

type Item = {
  enable: boolean
  icon: React.ReactNode | string
  label: string
  value: React.ReactNode | string
}

interface ListInformationsProps {
  event: Event | any // TODO: remove any
}

const ListInformations = ({ event }: ListInformationsProps) => {
  const items: Item[] = [
    {
      enable: !!event.localBeginAt && !!event.localFinishAt,
      label: "Date de l'événement",
      icon: <Iconify icon="solar:calendar-date-bold" />,
      value:
        `${event.localBeginAt && format(event.localBeginAt, 'dd MMMM yyyy')}${!isSameDay(event.localBeginAt, event.localFinishAt) ? ` - ${event.localFinishAt && format(event.localFinishAt, 'dd MMMM yyyy')}` : ''}`.toLowerCase(),
    },
    {
      enable: !!event.localBeginAt && !!event.localFinishAt,
      label: `Horaire${event.isParisTimeZone() ? '' : ` (${getTimezoneOffsetLabel(event.timeZone)})`}`,
      icon: <Iconify icon="solar:clock-circle-bold" />,
      value: event.localBeginAt && format(event.localBeginAt, 'HH:mm') + ' - ' + format(event.localFinishAt, 'HH:mm'),
    },
    {
      enable: true,
      label: 'Capacité',
      icon: <Iconify icon="solar:users-group-rounded-bold" />,
      value: event.capacity ? event.capacity : 'Pas précisé',
    },
    {
      enable: !event.visioUrl && event?.address?.route !== '' && event?.address?.postalCode !== '',
      label: 'Lieu',
      icon: <Iconify icon="mingcute:location-fill" />,
      value: (
        <Box>
          <Typography variant="body2" component="div" fontWeight="bold">
            {event?.address?.number} {event?.address?.route}
          </Typography>

          <Typography variant="body2" component="div" fontWeight="bold">
            {event?.address?.postalCode} {event?.address?.locality}
          </Typography>
        </Box>
      ),
    },
    {
      enable: !!event.visioUrl,
      label: 'Lien de visioconférence',
      icon: <Iconify icon="solar:videocamera-record-bold" />,
      value: (
        <Link
          color="primary"
          variant="body2"
          underline="hover"
          component={RouterLink}
          to={event.visioUrl}
          sx={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
          }}
          referrerPolicy="no-referrer"
          target="_blank"
          rel="noopener noreferrer"
        >
          {event.visioUrl}
        </Link>
      ),
    },
  ]

  return (
    <Card sx={{ p: '24px' }}>
      <Box>
        {items
          .filter(item => item.enable)
          .map((item, index) => (
            <List key={index}>
              <ListItem>
                <ListItemAvatar>{item.icon}</ListItemAvatar>

                <Box>
                  <Stack key={index}>
                    <Typography variant="body2" component="div">
                      {item.label}
                    </Typography>
                    <Typography variant="subtitle2" component="div">
                      {item.value}
                    </Typography>
                  </Stack>
                </Box>
              </ListItem>
            </List>
          ))}
      </Box>
    </Card>
  )
}

export default ListInformations
