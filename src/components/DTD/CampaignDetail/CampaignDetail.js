import { useMemo, useState } from 'react'
import { useParams } from 'react-router'
import { Container, Grid, Typography, Tabs, Tab as MuiTab } from '@mui/material'
import { styled } from '@mui/system'
import InfiniteScroll from 'react-infinite-scroll-component'

import {
  getDTDCampaignQuery,
  getDTDCampaignCallers,
  getDTDCampaignHistory,
  getDTDCampaignSurveysReplies,
} from 'api/DTD'
import { getNextPageParam, usePaginatedData } from 'api/pagination'
import { useErrorHandler } from 'components/shared/error/hooks'
import pluralize from 'components/shared/pluralize/pluralize'
import CampaignDetailKPI from './CampaignDetailKPI'
import CampaignDetailCallers from './CampaignDetailCallers'
import CampaignDetailHistory from './CampaignDetailHistory'
import CampaignDetailSurveys from './CampaignDetailSurveys'
import CreateEdit from '../CreateEdit/CreateEdit'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import PageHeader from 'ui/PageHeader'
import Loader from 'ui/Loader'
import { useInfiniteQueryWithScope, useQueryWithScope } from 'api/useQueryWithScope'

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
  DTD: { id: 'DTD', label: 'porte-à-porteur' },
  doors: { id: 'doors', label: 'porte' },
  surveys: { id: 'surveys', label: 'questionnaire' },
}

export const CampaignDetail = () => {
  const [selectedTab, setSelectedTab] = useState(messages.DTD.id)
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false)
  const { campaignId } = useParams()
  const { handleError } = useErrorHandler()

  const { data: campaign = {}, refetch: refetchCampaign } = useQueryWithScope(
    ['campaign', campaignId],
    () => getDTDCampaignQuery(campaignId),
    {
      onError: handleError,
    }
  )
  const { data: callers = [], isLoading: isCallersLoading } = useQueryWithScope(
    ['callers', campaignId],
    () => getDTDCampaignCallers(campaignId),
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
    pageParams => getDTDCampaignHistory({ campaignId, ...pageParams }),
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
    () => !!(isCallersLoading || isHistoryLoading || isSurveysLoading),
    [isCallersLoading, isHistoryLoading, isSurveysLoading]
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
              <PageTitle sx={{ color: 'campaign.color' }}>{messages.pageTitle}</PageTitle>
              <PageTitle sx={{ color: 'gray400' }}>&nbsp;{'>'}&nbsp;</PageTitle>
              <PageTitle sx={{ color: 'gray800' }}>{campaign.title}</PageTitle>
            </>
          }
          button={<PageHeaderButton onClick={() => setIsCreateEditModalOpen(true)} label={messages.modify} />}
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

        {!isLoadingData && (
          <>
            <Tabs
              value={selectedTab}
              onChange={handleChange}
              TabIndicatorProps={{ sx: { bgcolor: 'indigo700' } }}
              sx={{ my: 2 }}
            >
              {[messages.DTD, messages.doors, messages.surveys].map(({ id, label }) => (
                <Tab
                  key={id}
                  value={id}
                  label={
                    <TabLabel>
                      {id === messages.DTD.id && `${callers.length} ${pluralize(callers.length, label)}`}
                      {id === messages.doors.id &&
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

            {selectedTab === messages.DTD.id && callers.length > 0 && (
              <Grid container spacing={2}>
                {callers.map((caller, index) => (
                  <CampaignDetailCallers
                    key={index + 1}
                    number={index + 1}
                    firstName={caller.firstName}
                    lastName={caller.lastName}
                    count={caller.count}
                    goal={campaign.goal}
                  />
                ))}
              </Grid>
            )}
            {selectedTab === messages.doors.id && history.length > 0 && (
              <InfiniteScroll
                dataLength={history.length}
                next={() => fetchNexPageHistory()}
                hasMore={hasNextPageHistory}
                loader={<Loader />}
              >
                <Grid container spacing={2}>
                  {history.map(call => (
                    <CampaignDetailHistory
                      key={call.id}
                      status={call.status}
                      startDate={campaign.startDate}
                      adherent={call.adherent}
                      caller={call.caller}
                      updateTime={call.updateTime}
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

      <CreateEdit
        campaign={Object.keys(campaign).length > 0 ? campaign : null}
        isOpen={isCreateEditModalOpen}
        onCreateResolve={refetchCampaign}
        handleClose={() => setIsCreateEditModalOpen(false)}
      />
    </Container>
  )
}

export default CampaignDetail
