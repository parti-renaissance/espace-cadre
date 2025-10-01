import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, ButtonGroup, Card, Container, Grid, Link, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { getEvents, getMyEvents } from '~/api/events'
import PageHeader from '~/ui/PageHeader'
import { messages } from '~/components/Events/shared/constants'
import { paths as eventsPath } from '~/components/Events/shared/paths'
import TabsComponent, { TabProps } from '~/components/Events/Components/Tabs'
import { TabPanel } from '~/components/Events/Components'
import Iconify from '~/mui/iconify'
import EventList from '~/components/Events/pages/list/components/EventList'
import { OAUTH_HOST } from '~/shared/environments'

const ListEvents = () => {
  const navigate = useNavigate()

  const [selectedTab, setSelectedTab] = useState<number>(0)

  const { data: countOnlyMine, isLoading: isLoadingCountOnlyMine } = useQuery(
    ['countOnlyMine', { feature: 'Events', view: 'Events' }],
    () => getMyEvents({ countOnlyMine: true })
  )

  const countEventsOnlyMine = countOnlyMine?.total || 0

  const tabs: TabProps[] = useMemo(
    () => [
      {
        id: 'allEvents',
        label: messages.allEvents,
        query: getEvents,
      },
      {
        id: 'myEvents',
        label: messages.myEvents,
        query: getMyEvents,
        count: isLoadingCountOnlyMine ? undefined : countEventsOnlyMine,
      },
    ],
    [countEventsOnlyMine, isLoadingCountOnlyMine]
  )

  return (
    <Container maxWidth={'xl'} sx={{ mb: 3 }}>
      <Grid container justifyContent="space-between">
        <PageHeader
          title={messages.title}
          button={
            <Stack alignItems="center" direction="row" spacing={2}>
              <ButtonGroup variant="contained" color="inherit" size="medium">
                <Button
                  data-cy="ui-page-header-button"
                  startIcon={<Iconify icon="eva:plus-fill" color="white" />}
                  onClick={() => navigate(eventsPath.create)}
                >
                  {messages.create}
                </Button>
              </ButtonGroup>
            </Stack>
          }
        />
      </Grid>

      <Card sx={{ backgroundColor: '#ECE2FF', border: '1px solid #D4C2FF' }}>
        <Grid container alignItems="flex-start" justifyContent="space-between" sx={{ padding: '24px' }}>
          <Grid item xs={12} sm={10} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  backgroundColor: '#F7F2FF',
                  color: '#714991',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontWeight: 'bold',
                  fontSize: '14px',
                }}
              >
                Nouveau
              </Typography>
            </Box>
            <Typography sx={{ color: '#714991', fontWeight: 500, fontSize: '16px' }}>
              Les événements sont maintenant gérés directement sur l&apos;espace militant depuis l&apos;onglet{' '}
              <Link href={`${OAUTH_HOST}/app/evenements`}>&quot;Événements&ldquo;</Link>
            </Typography>
          </Grid>
        </Grid>
      </Card>

      <TabsComponent elements={tabs} value={selectedTab} onChangeTab={(_, index) => setSelectedTab(index)} />

      {tabs.map((tab, index) => (
        <TabPanel key={tab.id} value={selectedTab} index={index}>
          <EventList query={tab.query} queryKey={[tab.id]} />
        </TabPanel>
      ))}
    </Container>
  )
}

export default ListEvents
