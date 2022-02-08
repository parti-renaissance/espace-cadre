import { useState } from 'react'
import { Event } from 'domain/event'
import { Container, Grid, Tab as MuiTab, Tabs, Typography } from '@mui/material'
import PageHeader from 'ui/PageHeader'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import { styled } from '@mui/system'
import EventList from 'components/events/EventList'
import { getEvents, getMyEvents } from 'api/events'

const Tab = styled(MuiTab)(({ theme }) => ({
  textTransform: 'none',
  color: theme.palette.gray400,
  '&.Mui-selected': {
    color: theme.palette.gray800,
  },
}))
const TabLabel = styled(Typography)`
  font-size: 18px;
  font-weight: 400;
`

const tabs = {
  allEvents: { id: 'allEvents', query: getEvents },
  myEvents: { id: 'myEvents', query: getMyEvents },
}

const messages = {
  title: 'Évènements',
  create: 'Créer un évènement',
  allEvents: 'Tous les évènements',
  myEvents: 'Mes évènements',
}

const Events = () => {
  const [, setCurrentEvent] = useState(Event.NULL)
  const [selectedTab, setSelectedTab] = useState(tabs.allEvents.id)

  const handleCreateEvent = () => {
    setCurrentEvent(Event.NULL)
  }

  const handleChange = (_, tabId) => {
    setSelectedTab(tabId)
  }

  return (
    <Container maxWidth="lg" sx={{ mb: 3 }}>
      <Grid container justifyContent="space-between">
        <PageHeader
          title={messages.title}
          button={<PageHeaderButton onClick={handleCreateEvent} label={messages.create} />}
        />
      </Grid>
      <Tabs
        value={selectedTab}
        onChange={handleChange}
        TabIndicatorProps={{ sx: { bgcolor: 'indigo700' } }}
        sx={{ my: 2 }}
      >
        {Object.values(tabs).map(tab => (
          <Tab
            key={tab.id}
            value={tab.id}
            label={<TabLabel>{messages[tab.id]}</TabLabel>}
            disableRipple
            disableFocusRipple
          />
        ))}
      </Tabs>
      <EventList query={tabs[selectedTab].query} queryKey={selectedTab} />
    </Container>
  )
}

export default Events
