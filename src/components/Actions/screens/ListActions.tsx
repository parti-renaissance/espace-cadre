import { Button, ButtonGroup, Container, Grid, Stack } from '@mui/material'
import PageHeader from '~/ui/PageHeader'
import { messages } from '~/components/Events/shared/constants'
import Iconify from '~/mui/iconify'
import { useNavigate } from 'react-router'
import { actionsRoutes } from '~/components/Actions/actionsRoutes'
import TabsComponent, { TabProps } from '~/components/Tabs/Tabs'
import { SyntheticEvent, useCallback, useMemo, useState } from 'react'
import { getEvents, getMyEvents } from '~/api/events'

export default function ListActions() {
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState<number>(0)

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
        count: 1,
      },
    ],
    []
  )

  const onCreate = useCallback(() => navigate(actionsRoutes.create), [navigate])

  const onTabChange = useCallback((_: SyntheticEvent<Element, Event>, index: number) => setSelectedTab(index), [])

  return (
    <Container maxWidth={'xl'} sx={{ mb: 3 }}>
      <Grid container justifyContent="space-between">
        <PageHeader
          title={'Actions'}
          button={
            <Stack alignItems="center" direction="row" spacing={2}>
              <ButtonGroup variant="contained" color="inherit" size="medium">
                <Button
                  data-cy="ui-page-header-button"
                  startIcon={<Iconify icon="eva:plus-fill" color="white" />}
                  onClick={onCreate}
                  id={'action-create-button'}
                >
                  Créer une action
                </Button>
              </ButtonGroup>
            </Stack>
          }
        />
      </Grid>

      <TabsComponent elements={tabs} value={selectedTab} onChangeTab={onTabChange} />
    </Container>
  )
}
