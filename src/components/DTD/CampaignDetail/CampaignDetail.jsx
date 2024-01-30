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
} from '~/api/DTD'
import { getNextPageParam, usePaginatedData, usePaginatedDataCount } from '~/api/pagination'
import { useErrorHandler } from '~/components/shared/error/hooks'
import pluralize from '~/components/shared/pluralize/pluralize'
import CampaignDetailKPI from './CampaignDetailKPI'
import CampaignDetailQuestioner from './CampaignDetailQuestioner'
import CampaignDetailHistory from './CampaignDetailHistory'
import CampaignDetailSurveys from './CampaignDetailSurveys'
import PageHeader from '~/ui/PageHeader'
import Loader from '~/ui/Loader'
import { useInfiniteQueryWithScope, useQueryWithScope } from '~/api/useQueryWithScope'
import paths from '~/shared/paths'

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
  questioners: { id: 'questioners', label: 'porte-à-porteur' },
  history: { id: 'history', label: 'porte' },
  surveys: { id: 'surveys', label: 'questionnaire' },
}

export const CampaignDetail = () => {
  const [selectedTab, setSelectedTab] = useState(messages.questioners.id)
  const { campaignId } = useParams()
  const { handleError } = useErrorHandler()

  const { data: campaignDetail = {} } = useQueryWithScope(
    ['campaign-detail', { feature: 'DTD', view: 'CampaignDetail' }, campaignId],
    () => getDTDCampaignDetailQuery(campaignId),
    {
      onError: handleError,
    }
  )
  const {
    data: paginatedQuestioners = null,
    isLoading: isQuestionersLoading,
    fetchNextPage: fetchNextPageQuestioners,
    hasNextPage: hasNextPageQuestioners,
  } = useInfiniteQueryWithScope(
    ['paginated-questioners', { feature: 'DTD', view: 'CampaignDetail' }, campaignId],
    pageParams => getDTDCampaignQuestioners({ campaignId, ...pageParams }),
    {
      onError: handleError,
    }
  )
  const questioners = usePaginatedData(paginatedQuestioners)
  const questionersTotalCount = usePaginatedDataCount(paginatedQuestioners)

  const {
    data: paginatedHistory = null,
    isLoading: isHistoryLoading,
    fetchNextPage: fetchNextPageHistory,
    hasNextPage: hasNextPageHistory,
  } = useInfiniteQueryWithScope(
    ['paginated-history', { feature: 'DTD', view: 'CampaignDetail' }, campaignId],
    pageParams => getDTDCampaignDetailHistory({ campaignId, ...pageParams }),
    {
      getNextPageParam,
      onError: handleError,
    }
  )
  const history = usePaginatedData(paginatedHistory)

  const { data: surveys = {}, isLoading: isSurveysLoading } = useQueryWithScope(
    ['surveys', { feature: 'DTD', view: 'CampaignDetail' }, campaignId],
    () => getDTDCampaignSurveysReplies({ campaignId, pageSize: 1, pageNumber: 0 }),
    {
      onError: handleError,
    }
  )
  const surveysTotalCount = surveys?.totalCount

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

  if (!campaignId) {
    return null
  }

  return (
    <Container maxWidth={false} sx={{ mb: 3 }}>
      <Grid container justifyContent="space-between">
        <PageHeader title={messages.pageTitle} titleLink={paths.pap} titleSuffix={campaignDetail.title} />
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
                        `${questionersTotalCount} ${pluralize(questionersTotalCount, label)}`}
                      {id === messages.history.id &&
                        `${paginatedHistory?.pages[0].total || 0} ${pluralize(
                          paginatedHistory?.pages[0].total || 0,
                          label
                        )}`}
                      {id === messages.surveys.id &&
                        `${surveysTotalCount || 0} ${pluralize(surveysTotalCount || 0, label)}`}
                    </TabLabel>
                  }
                  disableRipple
                  disableFocusRipple
                />
              ))}
            </Tabs>

            {selectedTab === messages.questioners.id && questioners.length > 0 && (
              <Container>
                <InfiniteScroll
                  dataLength={questioners.length}
                  next={() => fetchNextPageQuestioners()}
                  hasMore={hasNextPageQuestioners}
                  loader={<Loader />}
                >
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
                </InfiniteScroll>
              </Container>
            )}
            {selectedTab === messages.history.id && history.length > 0 && (
              <Container>
                <InfiniteScroll
                  dataLength={history.length}
                  next={() => fetchNextPageHistory()}
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
              </Container>
            )}
            {selectedTab === messages.surveys.id && surveys.replies?.length > 0 && (
              <Grid container spacing={2}>
                <CampaignDetailSurveys />
              </Grid>
            )}
          </>
        )}
      </Grid>
    </Container>
  )
}

export default CampaignDetail
