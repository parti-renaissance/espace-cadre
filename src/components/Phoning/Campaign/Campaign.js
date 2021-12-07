import { useState } from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router'
import { v1 as uuid } from 'uuid'
import { Container, Grid, Typography, Tabs, Tab as MuiTab } from '@mui/material'
import { styled } from '@mui/system'

import { useErrorHandler } from 'components/shared/error/hooks'
import { getPhoningCampaignQuery, getPhoningCampaignCallers, getPhoningCampaignHistory } from 'api/phoning'
import PageHeader from 'ui/PageHeader'
import CampaignCallers from './CampaignCallers'
import CampaignHistory from './CampaignHistory'
import CampaignSurveys from './CampaignSurveys'
import PhoningCampaignKPI from './CampaignKPI'

const Tab = styled(MuiTab)(({ theme }) => ({
  textTransform: 'none',
  color: theme.palette.gray400,
  '&.Mui-selected': {
    color: theme.palette.gray800,
  },
}))
const TabLabel = styled(Typography)`
  font-size: 18px;
  font-weigh: 400;
`

const messages = {
  title: 'Phoning',
  subtitle: 'Consultation spéciale',
  headerActionLabel: 'modifier',
  calling: { id: 'calling', label: 'appelants' },
  calls: { id: 'calls', label: 'appels' },
  surveys: { id: 'survey', label: 'questionnaires' },
  surveysTitle: 'Questionnaires',
  KPITitle: 'Indicateurs',
}

export const PhoningCampaign = () => {
  const [selectedTab, setSelectedTab] = useState(messages.calls.id)
  const { campaignId } = useParams()
  const { handleError } = useErrorHandler()
  const { data: campaign = {} } = useQuery('campaign', () => getPhoningCampaignQuery(campaignId), {
    onError: handleError,
  })
  const { data: callers = [] } = useQuery('callers', () => getPhoningCampaignCallers(campaignId), {
    onError: handleError,
  })
  const { data: history = [] } = useQuery(['history'], () => getPhoningCampaignHistory(campaignId), {
    onError: handleError,
  })

  const handleChange = (_, tabId) => {
    setSelectedTab(tabId)
  }

  const handleHistoryView = id => () => {
    // TODO: View modal
  }

  return (
    <Container maxWidth="xl" sx={{ mb: 3 }}>
      <Grid container justifyContent="space-between">
        <PageHeader
          title={messages.title}
          message={messages.headerActionLabel}
          parentStyles={{ color: 'indigo700', background: '#F0EFFB' }}
          handleAction={() => {}}
        />
      </Grid>
      <Grid container justifyContent="space-between">
        {Object.keys(campaign).length > 0 && (
          <PhoningCampaignKPI
            dayRemaining={campaign.dayRemaining}
            surveys={campaign.surveys}
            calls={campaign.calls}
            averageTime={campaign.averageTime}
          />
        )}

        <Tabs
          value={selectedTab}
          onChange={handleChange}
          TabIndicatorProps={{ sx: theme => ({ background: theme.palette.indigo700 }) }}
          sx={{ my: 2 }}
        >
          {[messages.calling, messages.calls, messages.surveys].map(({ id, label }) => (
            <Tab
              key={id}
              value={id}
              label={
                <TabLabel>
                  {id === messages.calling.id && `${callers.length} `}
                  {id === messages.calls.id && `${history.length} `}
                  {id === messages.surveys.id && `${[].length} `}
                  {label}
                </TabLabel>
              }
              disableRipple
              disableFocusRipple
            />
          ))}
        </Tabs>

        {selectedTab === messages.calling.id && campaign.goalPerCaller?.toString() && (
          <Grid container spacing={2}>
            {callers.map((caller, index) => (
              <CampaignCallers
                key={uuid()}
                number={index + 1}
                firstName={caller.firstName}
                lastName={caller.lastName}
                count={caller.count}
                goal={campaign.goalPerCaller}
              />
            ))}
          </Grid>
        )}
        {selectedTab === messages.calls.id && (
          <Grid container spacing={2}>
            {history.map(element => (
              <CampaignHistory
                key={element.id}
                status={element.status}
                adherent={element.adherent}
                caller={element.caller}
                updateTime={element.updateTime}
                handleClick={handleHistoryView(element.id)}
              />
            ))}
          </Grid>
        )}
        {selectedTab === messages.surveys.id && <CampaignSurveys />}
      </Grid>
    </Container>
  )
}

export default PhoningCampaign
