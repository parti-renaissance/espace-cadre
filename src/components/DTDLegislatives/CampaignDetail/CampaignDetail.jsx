import { useState, useMemo } from 'react'
import { Container, Grid, Tab as MuiTab, Tabs, Typography } from '@mui/material'
import { styled } from '@mui/system'
import PageHeader from 'ui/PageHeader'
import EditIcon from 'ui/icons/EditIcon'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import paths from 'shared/paths'
import { useParams } from 'react-router'
import { useQueryWithScope, useInfiniteQueryWithScope } from 'api/useQueryWithScope'
import {
  getDTDCampaignQuery,
  getDTDCampaignDetailQuery,
  getDTDCampaignQuestioners,
  getDTDCampaignSurveysReplies,
  getDTDCampaignSurveysAddress,
} from 'api/DTD'
import { useErrorHandler } from 'components/shared/error/hooks'
import CampaignDetailKPI from './CampaignDetailKpi'
import CampaignDetailAddresses from './CampaignDetailAddresses'
import CampaignDetailQuestioners from './CampaignDetailQuestioners'
import CampaignDetailSurveys from './CampaignDetailSurveys'
import pluralize from 'components/shared/pluralize/pluralize'
import InfiniteScroll from 'react-infinite-scroll-component'
import { usePaginatedData, usePaginatedDataCount } from 'api/pagination'
import Loader from 'ui/Loader'
import CreateEditModal from '../CreateEditModal'

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
  title: 'Porte à porte local',
  addresses: { id: 'addresses', label: 'Adresse' },
  dtdPrefix: 'Porte-à-',
  dtdSuffix: { id: 'dtd', label: 'porteur' },
  surveys: { id: 'survey', label: 'Questionnaire' },
  edit: 'Modifier',
}

const CampaignDetail = () => {
  const { handleError } = useErrorHandler()
  const { campaignId } = useParams()
  const [selectedTab, setSelectedTab] = useState(messages.dtdSuffix.id)
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false)

  const { data: campaignDetail = {}, refetch: refetchCampaignDetail } = useQueryWithScope(
    ['campaign', { feature: 'DTD', view: 'Campaign' }, campaignId],
    () => getDTDCampaignDetailQuery(campaignId),
    {
      onError: handleError,
    }
  )

  const { data: campaign = null, refetch: refetchCampaign } = useQueryWithScope(
    ['campaign-detail', { feature: 'DTD', view: 'DTD' }],
    () => getDTDCampaignQuery(campaignId),
    {
      onError: handleError,
    }
  )

  const {
    data: paginatedQuestioners = null,
    fetchNextPage: fetchNextPageQuestioners,
    hasNextPage: hasNextPageQuestioners,
    isLoading: isQuestionersLoading,
  } = useInfiniteQueryWithScope(
    ['paginated-questioners', { feature: 'DTD', view: 'CampaignDetail' }, campaignId],
    pageParams => getDTDCampaignQuestioners({ campaignId, ...pageParams }),
    {
      onError: handleError,
    }
  )
  const questioners = usePaginatedData(paginatedQuestioners)
  const questionersTotalCount = usePaginatedDataCount(paginatedQuestioners)

  const { data: surveys = {}, isLoading: isSurveysLoading } = useQueryWithScope(
    ['surveys', { feature: 'DTD', view: 'CampaignDetail' }, campaignId],
    () => getDTDCampaignSurveysReplies({ campaignId, pageSize: 1, pageNumber: 0 }),
    {
      onError: handleError,
    }
  )
  const surveysTotalCount = surveys?.totalCount

  const { data: addresses = {} } = useQueryWithScope(
    ['surveys-detail-address', { feature: 'DTD', view: 'CampaignDetailSurveysAddress' }, campaignId],
    () => getDTDCampaignSurveysAddress({ campaignId }),
    {
      onError: handleError,
    }
  )
  const addressesTotalCount = addresses?.totalCount

  const isLoadingData = useMemo(
    () => !!(isQuestionersLoading || isSurveysLoading),
    [isQuestionersLoading, isSurveysLoading]
  )

  const handleTabChange = (_, tabId) => {
    setSelectedTab(tabId)
  }

  const handleClose = () => {
    setIsCreateEditModalOpen(false)
  }

  if (!campaignId) {
    return null
  }

  return (
    <Container maxWidth={false}>
      <Grid container justifyContent="space-between">
        <PageHeader
          title={messages.title}
          titleLink={paths.pap_v2}
          titleSuffix={campaignDetail.title}
          button={
            <PageHeaderButton
              onClick={() => (Object.keys(campaignDetail).length > 0 ? setIsCreateEditModalOpen(true) : null)}
              label={messages.edit}
              icon={<EditIcon sx={{ color: 'campaign.color', fontSize: '20px' }} />}
              isMainButton
            />
          }
        />
      </Grid>
      <Grid container justifyContent="space-between">
        {campaignDetail.KPI && Object.keys(campaignDetail.KPI).length > 0 && (
          <CampaignDetailKPI
            surveys={campaignDetail.KPI.surveys}
            doors={campaignDetail.KPI.doors}
            contacts={campaignDetail.KPI.contacts}
            addresses={campaignDetail.KPI.addresses}
          />
        )}
        {!isLoadingData && (
          <>
            {' '}
            <Tabs
              variant="scrollable"
              value={selectedTab}
              onChange={handleTabChange}
              TabIndicatorProps={{ sx: { bgcolor: 'indigo700' } }}
              sx={{ my: 2 }}
            >
              {[messages.addresses, messages.dtdSuffix, messages.surveys].map(({ id, label }) => (
                <Tab
                  key={id}
                  value={id}
                  label={
                    <TabLabel>
                      {id === messages.addresses.id &&
                        `${addressesTotalCount} ${pluralize(addressesTotalCount, label)}`}
                      {id === messages.dtdSuffix.id &&
                        `${questionersTotalCount} ${messages.dtdPrefix}${pluralize(questionersTotalCount, label)}`}
                      {id === messages.surveys.id && `${surveysTotalCount || 0} ${pluralize(surveysTotalCount, label)}`}
                    </TabLabel>
                  }
                  disableRipple
                  disableFocusRipple
                />
              ))}
            </Tabs>
            {selectedTab === messages.addresses.id && (
              <Grid container spacing={2}>
                <CampaignDetailAddresses />
              </Grid>
            )}
            {selectedTab === messages.dtdSuffix.id && questioners.length > 0 && (
              <Container>
                <InfiniteScroll
                  dataLength={questioners.length}
                  next={() => fetchNextPageQuestioners()}
                  hasMore={hasNextPageQuestioners}
                  loader={<Loader />}
                >
                  <Grid container spacing={2}>
                    {questioners.map((questioner, index) => (
                      <CampaignDetailQuestioners
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
            {selectedTab === messages.surveys.id && (
              <Grid container spacing={2}>
                <CampaignDetailSurveys />
              </Grid>
            )}
          </>
        )}
      </Grid>
      {isCreateEditModalOpen && (
        <CreateEditModal
          open={isCreateEditModalOpen}
          handleClose={handleClose}
          campaign={campaign}
          onUpdateResolve={() => {
            refetchCampaignDetail()
            refetchCampaign()
          }}
        />
      )}
    </Container>
  )
}

export default CampaignDetail
