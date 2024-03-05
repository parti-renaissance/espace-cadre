import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Grid, ButtonGroup, Button, Stack } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { getCategoriesWithGroups, getEvents, getMyEvents } from '~/api/events'
import PageHeader from '~/ui/PageHeader'
import { ONE_DAY, messages } from '~/components/Events/shared/constants'
import { paths as eventsPath } from '~/components/Events/shared/paths'
import TabsComponent from '~/components/Events/Components/Tabs'
import { TabPanel } from '~/components/Events/Components'
import Iconify from '~/mui/iconify'
import EventList from '~/components/Events/pages/list/components/EventList'

type Tab = {
  id: string
  label: string
  query: any
  count?: number
}

const ListEvents = () => {
  const navigate = useNavigate()

  const [selectedTab, setSelectedTab] = useState<number>(0)

  useQuery(['categories', { feature: 'Events', view: 'Events' }], () => getCategoriesWithGroups(), {
    cacheTime: ONE_DAY,
    staleTime: ONE_DAY,
  })

  const { data: countOnlyMine, isLoading: isLoadingCountOnlyMine } = useQuery(
    ['countOnlyMine', { feature: 'Events', view: 'Events' }],
    () => getMyEvents({ countOnlyMine: true })
  )

  const countEventsOnlyMine = countOnlyMine?.total || 0

  const tabs: Tab[] = useMemo(
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
    <Container maxWidth={false} sx={{ mb: 3 }}>
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
