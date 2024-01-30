import { useMemo, useState } from 'react'
import { useParams } from 'react-router'
import { Container, Grid, Typography, Tabs, Tab as MuiTab } from '@mui/material'
import { styled } from '@mui/system'
import InfiniteScroll from 'react-infinite-scroll-component'

import {
  getPhoningCampaignQuery,
  getPhoningCampaignCallers,
  getPhoningCampaignHistory,
  getPhoningCampaignSurveysReplies,
} from '~/api/phoning'
import { getNextPageParam, usePaginatedData } from '~/api/pagination'
import { useInfiniteQueryWithScope, useQueryWithScope } from '~/api/useQueryWithScope'
import { useErrorHandler } from '~/components/shared/error/hooks'
import pluralize from '~/components/shared/pluralize/pluralize'
import CampaignDetailKPI from './CampaignDetailKPI'
import CampaignDetailCaller from './CampaignDetailCaller'
import CampaignDetailHistory from './CampaignDetailHistory'
import CampaignDetailSurveys from './CampaignDetailSurveys'
import CreateEdit from '../CreateEdit/CreateEdit'
import { PageHeaderButton } from '~/ui/PageHeader/PageHeader'
import PageHeader from '~/ui/PageHeader'
import Loader from '~/ui/Loader'
import EditIcon from '~/ui/icons/EditIcon'
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
  pageTitle: 'Phoning',
  modify: 'modifier',
  surveysTitle: 'Questionnaires',
  callers: { id: 'callers', label: 'appelant' },
  history: { id: 'history', label: 'appel' },
  surveys: { id: 'survey', label: 'questionnaire' },
}

export const CampaignDetail = () => {
  const [selectedTab, setSelectedTab] = useState(messages.callers.id)
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false)
  const { campaignId } = useParams()
  const { handleError } = useErrorHandler()

  const { data: campaignDetail = {}, refetch: refetchCampaignDetail } = useQueryWithScope(
    ['campaign-detail', { feature: 'Phoning', view: 'CampaignDetail' }, campaignId],
    () => getPhoningCampaignQuery(campaignId),
    {
      onError: handleError,
    }
  )
  const {
    data: callers = [],
    isLoading: isCallersLoading,
    refetch: refetchCallers,
  } = useQueryWithScope(
    ['callers', { feature: 'Phoning', view: 'CampaignDetail' }, campaignId],
    () => getPhoningCampaignCallers(campaignId),
    {
      onError: handleError,
    }
  )

  const {
    data: paginatedHistory = null,
    isLoading: isHistoryLoading,
    fetchNextPage: fetchNextPageHistory,
    hasNextPage: hasNextPageHistory,
  } = useInfiniteQueryWithScope(
    ['paginated-history', { feature: 'Phoning', view: 'CampaignDetail' }, campaignId],
    pageParams => getPhoningCampaignHistory({ campaignId, ...pageParams }),
    {
      getNextPageParam,
      onError: handleError,
    }
  )
  const history = usePaginatedData(paginatedHistory)

  const { data: surveys = {}, isLoading: isSurveysLoading } = useQueryWithScope(
    ['surveys', { feature: 'Phoning', view: 'CampaignDetail' }, campaignId],
    () => getPhoningCampaignSurveysReplies(campaignId),
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

  const handleRefresh = () => {
    refetchCampaignDetail()
    refetchCallers()
  }

  if (!campaignId) {
    return null
  }

  return (
    <Container maxWidth={false} sx={{ mb: 3 }}>
      <Grid container justifyContent="space-between">
        <PageHeader
          title={messages.pageTitle}
          titleLink={paths.phoning_campaign}
          titleSuffix={campaignDetail.title}
          button={
            <PageHeaderButton
              label={messages.modify}
              icon={<EditIcon sx={{ color: 'main', fontSize: '20px' }} />}
              onClick={() => (Object.keys(campaignDetail).length > 0 ? setIsCreateEditModalOpen(true) : null)}
              data-cy="phoning-create-edit"
              isMainButton
            />
          }
        />
      </Grid>

      <Grid container justifyContent="space-between">
        {campaignDetail.KPI && Object.keys(campaignDetail.KPI).length > 0 && (
          <CampaignDetailKPI
            remaining={campaignDetail.KPI.remaining}
            surveys={campaignDetail.KPI.surveys}
            calls={campaignDetail.KPI.calls}
            averageTime={campaignDetail.KPI.averageTime}
          />
        )}

        {!isLoadingData && (
          <>
            <Tabs
              variant="scrollable"
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

            {selectedTab === messages.callers.id && callers.length > 0 && (
              <Grid container spacing={2}>
                {callers.map((caller, index) => (
                  <CampaignDetailCaller
                    key={index + 1}
                    number={index + 1}
                    firstName={caller.firstName}
                    lastName={caller.lastName}
                    count={caller.count}
                    goal={campaignDetail.goal}
                  />
                ))}
              </Grid>
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
                    {history.map(call => (
                      <CampaignDetailHistory
                        key={call.id}
                        status={call.status}
                        startDate={call.startDate}
                        adherent={call.adherent}
                        caller={call.caller}
                        updateTime={call.updateTime}
                      />
                    ))}
                  </Grid>
                </InfiniteScroll>
              </Container>
            )}
            {selectedTab === messages.surveys.id && surveys.replies?.length > 0 && (
              <Grid container spacing={2}>
                <CampaignDetailSurveys replies={surveys.replies} />
              </Grid>
            )}
          </>
        )}
      </Grid>

      {isCreateEditModalOpen && (
        <CreateEdit
          campaign={Object.keys(campaignDetail).length > 0 ? { id: campaignId, ...campaignDetail.createEdit } : null}
          onUpdateResolve={handleRefresh}
          handleClose={() => setIsCreateEditModalOpen(false)}
        />
      )}
    </Container>
  )
}

export default CampaignDetail
