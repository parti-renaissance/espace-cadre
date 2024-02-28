import React from 'react'
import { Card, List, ListItem, ListItemAvatar, Typography } from '@mui/material'
import { Box, Stack } from '@mui/system'
import Iconify from '~/mui/iconify'
import { Event } from '~/domain/event'
import { format } from 'date-fns'

type Item = {
  icon: React.ReactNode | string
  label: string
  value: React.ReactNode | string
}

interface ListInformationsProps {
  event: Event
}

const ListInformations = ({ event }: ListInformationsProps) => {
  console.log(event)
  /*
Payload from API:
{
  "id": "01b5c430-69ac-49f1-8a04-3cebc82d850e",
  "name": "Cinquième",
  "description": "Le cinquième repas de la journée",
  "timezone": "Europe/Paris",
  "createdAt": "2023-11-27T10:58:23.000Z",
  "beginAt": "2024-02-21T22:00:00.000Z",
  "finishAt": "2024-02-24T01:00:00.000Z",
  "organizer": "Antonin Carlin",
  "organizerId": "eece5446-5c34-4198-8fb6-6da45e8ff374",
  "attendees": 1,
  "scheduled": true,
  "capacity": null,
  "address": {
  "number": "",
    "route": "Rue du Pôle Nord",
    "postalCode": "75018",
    "locality": "Paris 18ème",
    "country": "FR"
},
  "categoryId": "moment-de-convivialite",
  "visioUrl": "",
  "mode": "meeting",
  "image": null,
  "committee": null,
  "eventLink": "https://staging-app.parti-renaissance.fr/espace-adherent/evenements/2024-02-21-cinquieme/afficher"
}
*/

  const items: Item[] = [
    {
      label: "Date de l'événement",
      icon: <Iconify icon="solar:calendar-date-bold" />,
      value: event.beginAt && format(event.beginAt, 'dd MMMM yyyy'),
    },
    {
      label: 'Horaire',
      icon: <Iconify icon="solar:clock-circle-bold" />,
      value: event.beginAt && format(event.beginAt, 'HH:mm') + ' - ' + format(event.finishAt, 'HH:mm'),
    },
    {
      label: 'Capacité',
      icon: <Iconify icon="solar:users-group-rounded-bold" />,
      value: event.capacity,
    },
  ]

  return (
    <Card sx={{ p: '24px' }}>
      <Box>
        {items.map((item, index) => (
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
