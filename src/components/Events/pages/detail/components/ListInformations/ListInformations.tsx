import React from 'react'
import { Card, List, ListItem, ListItemAvatar, Typography } from '@mui/material'
import { Box, Stack } from '@mui/system'
import Iconify from '~/mui/iconify'

type Item = {
  icon: React.ReactNode | string
  label: string
  value: React.ReactNode | string
}

interface ListInformationsProps {
  items: Item[]
}

const ListInformations = () => {
  const items: Item[] = [
    {
      label: "Date de l'événement",
      icon: <Iconify icon="solar:calendar-date-bold" />,
      value: '02 mai 2024',
    },
    {
      label: 'Horaire',
      icon: <Iconify icon="solar:clock-circle-bold" />,
      value: 'de 10:30 à 16:00',
    },
    {
      label: 'Capacité',
      icon: <Iconify icon="solar:users-group-rounded-bold" />,
      value: '500 personnes',
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
