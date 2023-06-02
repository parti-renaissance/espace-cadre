import { useCallback, useState } from 'react'
import { Container, Grid, Tab as MuiTab, Tabs, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { useQuery } from '@tanstack/react-query'
import { getCategories, getEvents, getMyEvents } from 'api/events'
import EventList from 'components/Events/EventList'
import CreateEditEvent from 'components/Events/CreateEditEvent'
import PageHeader from 'ui/PageHeader'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import { ONE_DAY } from './constants'

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
  myEvents: { id: 'myEvents', query: getMyEvents },
  allEvents: { id: 'allEvents', query: getEvents },
}

const messages = {
  title: 'Évènements',
  create: 'Créer un évènement',
  allEvents: 'Tous les évènements',
  myEvents: 'Mes évènements',
}

const noOp = () => () => {}

const Events = () => {
  const [selectedTab, setSelectedTab] = useState(tabs.myEvents.id)
  const [refetchEvents, setRefetchEvents] = useState(noOp)

  const [eventId, setEventId] = useState(null)

  useQuery(['categories', { feature: 'Events', view: 'Events' }], () => getCategories(), {
    cacheTime: ONE_DAY,
    staleTime: ONE_DAY,
  })

  const setRefetchEventsRef = useCallback(f => setRefetchEvents(() => f), [])

  const handleChangeTab = (_, tabId) => {
    setSelectedTab(tabId)
  }

  const handleCreation = async () => {
    await refetchEvents()
  }

  const handleEditEvent = id => () => {
    setEventId(id)
  }

  return (
    <Container maxWidth={false} sx={{ mb: 3 }}>
      <Grid container justifyContent="space-between">
        <PageHeader
          title={messages.title}
          button={
            <PageHeaderButton
              onClick={() => {
                setEventId('-1')
              }}
              label={messages.create}
              isMainButton
            />
          }
        />
      </Grid>
      <Tabs
        variant="scrollable"
        value={selectedTab}
        onChange={handleChangeTab}
        TabIndicatorProps={{ sx: { bgcolor: 'indigo700' } }}
        sx={{ mb: 2 }}
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
      <EventList
        onEdit={handleEditEvent}
        query={tabs[selectedTab].query}
        queryKey={selectedTab}
        currentView={tabs[selectedTab].id}
        setRefetchRef={setRefetchEventsRef}
      />
      {eventId !== null && (
        <CreateEditEvent
          handleClose={() => {
            setEventId(null)
          }}
          onUpdate={handleCreation}
          eventId={eventId}
        />
      )}
    </Container>
  )
}

export default Events
