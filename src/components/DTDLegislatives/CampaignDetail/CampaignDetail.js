import { useState, useMemo } from 'react'
import { Container, Grid, Tab as MuiTab, Tabs, Typography } from '@mui/material'
import { styled } from '@mui/system'
import PageHeader from 'ui/PageHeader'
import paths from 'shared/paths'
import { useParams } from 'react-router'
import { useQueryWithScope, useInfiniteQueryWithScope } from 'api/useQueryWithScope'
import { getDTDCampaignDetailQuery, getDTDCampaignQuestioners, getDTDCampaignSurveysReplies } from 'api/DTD'
import { useErrorHandler } from 'components/shared/error/hooks'
import DTDData from '../Data/DTDData'
import CampaignDetailKPI from './CampaignDetailKpi'
import CampaignDetailAddresses from './CampaignDetailAddresses'
import CampaignDetailQuestioners from './CampaignDetailQuestioners'
import CampaignDetailSurveys from './CampaignDetailSurveys'
import pluralize from 'components/shared/pluralize/pluralize'
import InfiniteScroll from 'react-infinite-scroll-component'
import { usePaginatedData, usePaginatedDataCount } from 'api/pagination'
import Loader from 'ui/Loader'

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
  title: 'Porte à porte législatives',
  addresses: { id: 'addresses', label: 'Adresse' },
  dtdPrefix: 'Porte-à-',
  dtdSuffix: { id: 'dtd', label: 'porteur' },
  surveys: { id: 'survey', label: 'Questionnaire' },
}

const CampaignDetail = () => {
  const { handleError } = useErrorHandler()
  const { campaignId } = useParams()
  const [selectedTab, setSelectedTab] = useState(messages.dtdSuffix.id)

  const { data: campaign = {} } = useQueryWithScope(
    ['campaign', { feature: 'DTD', view: 'Campaign' }, campaignId],
    () => getDTDCampaignDetailQuery(campaignId),
    {
      onError: handleError,
    }
  )

  const {
    data: paginatedQuestioners = null,
    fetchNextPage: fetchNexPageQuestioners,
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

  const isLoadingData = useMemo(
    () => !!(isQuestionersLoading || isSurveysLoading),
    [isQuestionersLoading, isSurveysLoading]
  )

  const handleTabChange = (_, tabId) => {
    setSelectedTab(tabId)
  }

  if (!campaignId) return null

  return (
    <Container maxWidth="lg">
      <Grid container justifyContent="space-between">
        <PageHeader title={messages.title} titleLink={paths.pap_v2} titleSuffix={campaign.title} />
      </Grid>
      <Grid container justifyContent="space-between">
        <CampaignDetailKPI campaign={campaign} />
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
                      {id === messages.addresses.id && `${0} ${label}`}
                      {id === messages.dtdSuffix.id &&
                        `${questionersTotalCount} ${messages.dtdPrefix}${pluralize(questionersTotalCount, label)}`}
                      {id === messages.surveys.id &&
                        `${surveysTotalCount || 0} ${pluralize(questionersTotalCount, label)}`}
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
            {selectedTab === messages.dtdSuffix.id && DTDData.length > 0 && (
              <Container>
                <InfiniteScroll
                  dataLength={questioners.length}
                  next={() => fetchNexPageQuestioners()}
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
                        goal={campaign.goal}
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
    </Container>
  )
}

export default CampaignDetail
