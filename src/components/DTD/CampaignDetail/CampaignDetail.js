import { useMemo, useState } from 'react'
import { useParams } from 'react-router'
import { Container, Grid, Typography, Tabs, Tab as MuiTab } from '@mui/material'
import { styled } from '@mui/system'
import InfiniteScroll from 'react-infinite-scroll-component'

import {
  getDTDCampaignDetailQuery,
  getDTDCampaignQuestioners,
  getDTDCampaignDetailHistory,
  getDTDCampaignSurveysReplies,
} from 'api/DTD'
import { getNextPageParam, usePaginatedData } from 'api/pagination'
import { useErrorHandler } from 'components/shared/error/hooks'
import pluralize from 'components/shared/pluralize/pluralize'
import CampaignDetailKPI from './CampaignDetailKPI'
import CampaignDetailQuestioner from './CampaignDetailQuestioner'
import CampaignDetailHistory from './CampaignDetailHistory'
import CampaignDetailSurveys from './CampaignDetailSurveys'
import PageHeader from 'ui/PageHeader'
import Loader from 'ui/Loader'
import { useInfiniteQueryWithScope, useQueryWithScope } from 'api/useQueryWithScope'
import { Link } from 'react-router-dom'
import paths from 'shared/paths'

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
  pageTitle: 'Porte à porte',
  modify: 'modifier',
  surveysTitle: 'Questionnaires',
  KPITitle: 'Indicateurs',
  questioners: { id: 'questioners', label: 'porte-à-porteur' },
  history: { id: 'history', label: 'porte' },
  surveys: { id: 'surveys', label: 'questionnaire' },
}

export const CampaignDetail = () => {
  const [selectedTab, setSelectedTab] = useState(messages.questioners.id)
  const { campaignId } = useParams()
  const { handleError } = useErrorHandler()

  const { data: campaignDetail = {} } = useQueryWithScope(
    ['campaign-detail', campaignId],
    () => getDTDCampaignDetailQuery(campaignId),
    {
      onError: handleError,
    }
  )
  const { data: questioners = [], isLoading: isQuestionersLoading } = useQueryWithScope(
    ['questioners', campaignId],
    () => getDTDCampaignQuestioners(campaignId),
    {
      onError: handleError,
    }
  )

  const {
    data: paginatedHistory = null,
    isLoading: isHistoryLoading,
    fetchNextPage: fetchNexPageHistory,
    hasNextPage: hasNextPageHistory,
  } = useInfiniteQueryWithScope(
    ['history', campaignId],
    pageParams => getDTDCampaignDetailHistory({ campaignId, ...pageParams }),
    {
      getNextPageParam,
      onError: handleError,
    }
  )
  const history = usePaginatedData(paginatedHistory)

  const { data: surveys = {}, isLoading: isSurveysLoading } = useQueryWithScope(
    ['surveys', campaignId],
    () => getDTDCampaignSurveysReplies(campaignId),
    {
      onError: handleError,
    }
  )
  const isLoadingData = useMemo(
    () => !!(isQuestionersLoading || isHistoryLoading || isSurveysLoading),
    [isQuestionersLoading, isHistoryLoading, isSurveysLoading]
  )

  const handleChange = (_, tabId) => {
    setSelectedTab(tabId)
  }

  const handleHistoryView = () => {
    // TODO: implement view modal
  }

  if (!campaignId) return null

  return (
    <Container maxWidth="lg" sx={{ mb: 3 }}>
      <Grid container justifyContent="space-between">
        <PageHeader
          title={
            <>
              <PageTitle sx={{ color: 'campaign.color' }}>
                <Link to={paths.pap}>{messages.pageTitle}</Link>
              </PageTitle>
              <PageTitle sx={{ color: 'gray400' }}>&nbsp;{'>'}&nbsp;</PageTitle>
              <PageTitle sx={{ color: 'gray800' }}>{campaignDetail.title}</PageTitle>
            </>
          }
        />
      </Grid>

      <Grid container justifyContent="space-between">
        {campaignDetail.KPI && Object.keys(campaignDetail.KPI).length > 0 && (
          <CampaignDetailKPI
            remaining={campaignDetail.KPI.remaining}
            surveys={campaignDetail.KPI.surveys}
            doors={campaignDetail.KPI.doors}
            contacts={campaignDetail.KPI.contacts}
          />
        )}

        {!isLoadingData && (
          <>
            <Tabs
              value={selectedTab}
              onChange={handleChange}
              TabIndicatorProps={{ sx: { bgcolor: 'indigo700' } }}
              sx={{ my: 2 }}
            >
              {[messages.questioners, messages.history, messages.surveys].map(({ id, label }) => (
                <Tab
                  key={id}
                  value={id}
                  label={
                    <TabLabel>
                      {id === messages.questioners.id &&
                        `${questioners.length} ${pluralize(questioners.length, label)}`}
                      {id === messages.history.id &&
                        `${paginatedHistory?.pages[0].total || 0} ${pluralize(
                          paginatedHistory?.pages[0].total || 0,
                          label
                        )}`}
                      {id === messages.surveys.id &&
                        `${surveys?.totalCount || 0} ${pluralize(surveys?.totalCount || 0, label)}`}
                    </TabLabel>
                  }
                  disableRipple
                  disableFocusRipple
                />
              ))}
            </Tabs>

            {selectedTab === messages.questioners.id && questioners.length > 0 && (
              <Grid container spacing={2}>
                {questioners.map((questioner, index) => (
                  <CampaignDetailQuestioner
                    key={index + 1}
                    number={index + 1}
                    firstName={questioner.firstName}
                    lastName={questioner.lastName}
                    count={questioner.count}
                    goal={campaignDetail.goal}
                  />
                ))}
              </Grid>
            )}
            {selectedTab === messages.history.id && history.length > 0 && (
              <InfiniteScroll
                dataLength={history.length}
                next={() => fetchNexPageHistory()}
                hasMore={hasNextPageHistory}
                loader={<Loader />}
              >
                <Grid container spacing={2}>
                  {history.map(door => (
                    <CampaignDetailHistory
                      key={door.id}
                      status={door.status}
                      questioner={door.questioner}
                      address={door.address}
                      startDate={door.startDate}
                      duration={door.duration}
                      handleView={handleHistoryView}
                    />
                  ))}
                </Grid>
              </InfiniteScroll>
            )}
            {selectedTab === messages.surveys.id && surveys.replies?.length > 0 && (
              <Grid container spacing={2}>
                <CampaignDetailSurveys replies={surveys.replies} />
              </Grid>
            )}
          </>
        )}
      </Grid>
    </Container>
  )
}

export default CampaignDetail
