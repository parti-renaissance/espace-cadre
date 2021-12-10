import { useState } from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router'
import { Container, Grid, Typography, Tabs, Tab as MuiTab } from '@mui/material'
import { styled } from '@mui/system'

import { getPhoningCampaignQuery, getPhoningCampaignCallers, getPhoningCampaignHistory } from 'api/phoning'
import { useErrorHandler } from 'components/shared/error/hooks'
import pluralize from 'components/shared/pluralize/pluralize'
import PageHeader from 'ui/PageHeader'
import CampaignDetailKPI from './KPI'
import CampaignDetailCallers from './Callers'
import CampaignDetailHistory from './History'

const PageTitle = styled(Typography)`
  font-size: 24px;
  font-weight: 400;
  line-height: 36px;
`
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

const messages = {
  pageTitle: 'Phoning',
  modify: 'modifier',
  surveysTitle: 'Questionnaires',
  KPITitle: 'Indicateurs',
  callers: { id: 'callers', label: 'appelant' },
  history: { id: 'history', label: 'appel' },
  surveys: { id: 'survey', label: 'questionnaire' },
}

export const CampaignDetail = () => {
  const [selectedTab, setSelectedTab] = useState(messages.callers.id)
  const { campaignId } = useParams()
  const { handleError } = useErrorHandler()
  const { data: campaign = {} } = useQuery('campaign', () => getPhoningCampaignQuery(campaignId), {
    onError: handleError,
  })
  const { data: callers = [] } = useQuery('callers', () => getPhoningCampaignCallers(campaignId), {
    onError: handleError,
  })
  const { data: history = [] } = useQuery('history', () => getPhoningCampaignHistory(campaignId), {
    onError: handleError,
  })

  const handleChange = (_, tabId) => {
    setSelectedTab(tabId)
  }

  const handleHistoryView = () => () => {
    // TODO: View modal
  }

  if (!campaign.title) return null

  return (
    <Container maxWidth="lg" sx={{ mb: 3 }}>
      <Grid container justifyContent="space-between">
        <PageHeader
          title={
            <>
              <PageTitle sx={{ color: 'phoning.background.main' }}>{messages.pageTitle}</PageTitle>
              <PageTitle sx={{ color: 'gray400' }}>&nbsp;{'>'}&nbsp;</PageTitle>
              <PageTitle sx={{ color: 'gray800' }}>{campaign.title}</PageTitle>
            </>
          }
          message={messages.modify}
          handleAction={() => {}}
          actionButtonProps={{
            sx: {
              color: 'phoning.background.main',
              bgcolor: 'phoning.background.hover',
              '&:hover': {
                bgcolor: 'phoning.background.hover',
              },
            },
          }}
        />
      </Grid>

      <Grid container justifyContent="space-between">
        {Object.keys(campaign).length > 0 && (
          <CampaignDetailKPI
            startDate={campaign.startDate}
            endDate={campaign.endDate}
            surveys={campaign.surveys}
            calls={campaign.calls}
            averageTime={campaign.averageTime}
          />
        )}

        <Tabs
          value={selectedTab}
          onChange={handleChange}
          TabIndicatorProps={{ sx: { bgcolor: 'indigo700' } }}
          sx={{ my: 2 }}
        >
          {[messages.callers, messages.history, messages.surveys].map(({ id, label }) => (
            <Tab
              key={id}
              value={id}
              label={
                <TabLabel>
                  {id === messages.callers.id && `${callers.length} ${pluralize(callers.length, label)}`}
                  {id === messages.history.id && `${history.length} ${pluralize(history.length, label)}`}
                  {id === messages.surveys.id && `${[].length} ${pluralize([].length, label)}`}
                </TabLabel>
              }
              disableRipple
              disableFocusRipple
            />
          ))}
        </Tabs>

        {selectedTab === messages.callers.id && campaign.goalPerCaller?.toString() && (
          <Grid container spacing={2}>
            {callers.map((caller, index) => (
              <CampaignDetailCallers
                key={index + 1}
                number={index + 1}
                firstName={caller.firstName}
                lastName={caller.lastName}
                count={caller.count}
                goal={campaign.goalPerCaller}
              />
            ))}
          </Grid>
        )}
        {selectedTab === messages.history.id && (
          <Grid container spacing={2}>
            {history.map(call => (
              <CampaignDetailHistory
                key={call.id}
                status={call.status}
                startDate={campaign.startDate}
                adherent={call.adherent}
                caller={call.caller}
                updateTime={call.updateTime}
                handleClick={handleHistoryView(call.id)}
              />
            ))}
          </Grid>
        )}
      </Grid>
    </Container>
  )
}

export default CampaignDetail
