import { useState } from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router'
import { Container, Grid, Typography, Tabs, Tab as MuiTab } from '@mui/material'
import { styled } from '@mui/system'

import { useErrorHandler } from 'components/shared/error/hooks'
import { getPhoningCampaignQuery } from 'api/phoning'
import PageHeader from 'ui/PageHeader'
import CampaignCalling from './CampaignCalling'
import CampaignCalls from './CampaignCalls'
import CampaignSurveys from './CampaignSurveys'
import PhoningCampaignKPI from './CampaignKPI'

import { callingMock, callsMock, KPIMock, surveysMock } from './mocks'

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
  const [selectedTab, setSelectedTab] = useState(messages.calling.id)
  const { campaignId } = useParams()
  const { handleError } = useErrorHandler()
  const { data: campaign = {} } = useQuery('campaign', () => getPhoningCampaignQuery(campaignId), {
    onError: handleError,
  })

  const handleChange = (_, tabId) => {
    setSelectedTab(tabId)
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
                  {id === messages.calling.id && `${callingMock.length} `}
                  {id === messages.calls.id && `${callsMock.length} `}
                  {id === messages.surveys.id && `${surveysMock.length} `}
                  {label}
                </TabLabel>
              }
              disableRipple
              disableFocusRipple
            />
          ))}
        </Tabs>

        {selectedTab === messages.calling.id && <CampaignCalling calling={callingMock} />}
        {selectedTab === messages.calls.id && <CampaignCalls calls={callsMock} />}
        {selectedTab === messages.surveys.id && <CampaignSurveys surveys={surveysMock} />}
      </Grid>
    </Container>
  )
}

export default PhoningCampaign
