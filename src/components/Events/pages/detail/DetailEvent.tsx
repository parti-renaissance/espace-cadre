import { Grid, Card, CardMedia, Box, Typography, Container, Button } from '@mui/material'
import { Stack } from '@mui/system'
import BadgeStatus from '~/components/Events/pages/list/components/CardEvent/components/badgeStatus'
import ListInformations from '~/components/Events/pages/detail/components/ListInformations'
import { ShareLink } from '~/components/Events/pages/detail/components'
import Iconify from '~/mui/iconify'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { paths } from '~/components/Events/shared/paths'
import { format } from 'date-fns'

const DetailEvent = () => {
  const navigate = useNavigate()

  const event = {
    status: 'en cours',
    date: '2023-12-02',
    time: '12:00',
    duration: '2h',
    finishAt: '2023-12-02',
    location: 'Paris',
    participants: 12,
    maxParticipants: 20,
    price: 0,
    visioUrl: 'https://zoom.cc/dashbokpzefokzeokzopkoard/123456',
    category: 'Atelier de reflexion',
    title: 'Atelier de réflexion sur le rôle du militantisme',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  }

  return (
    <Container maxWidth="xl">
      <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center" marginBottom={'28px'}>
        <Button startIcon={<Iconify icon="eva:arrow-ios-back-fill" />} onClick={() => navigate(paths.events)}>
          Retour
        </Button>

        <Button
          variant="contained"
          startIcon={<Iconify icon="solar:pen-bold" />}
          onClick={() => {
            throw new Error('Not implemented')
          }}
        >
          Modifier
        </Button>
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={12} lg={8} xl={8}>
          <Card sx={{ display: 'flex' }}>
            <Stack direction="column" spacing={2} width="100%" sx={{ p: '24px' }}>
              <CardMedia
                component="img"
                image="https://source.unsplash.com/random"
                sx={{ width: '100%', height: '295px', borderRadius: '8px' }}
              />

              <Box sx={{ flex: '1 0 auto' }}>
                <Stack direction="column" spacing={4}>
                  <Stack direction="column" spacing={2}>
                    <Typography variant="h4">{event.title}</Typography>
                    <Typography variant="caption" color="text.primary">
                      Mes évènements / {event.category}
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

                  <Box>
                    <Typography variant="body1" color="text.secondary" component="div" fontSize={14}>
                      Date de création : {format(new Date(), 'dd MMMM yyyy')}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
          <Stack direction="column" spacing={2}>
            <ListInformations />

            <ShareLink link={event.visioUrl} />

            <Card>
              <Stack direction="column" spacing={1} padding={'24px'}>
                <Typography variant="body2">Événement créer par :</Typography>
                <Typography variant="subtitle2">Jean Michel Aulas</Typography>
              </Stack>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  )
}

export default DetailEvent
