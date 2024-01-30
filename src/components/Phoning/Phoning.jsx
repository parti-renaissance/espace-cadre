import { useMemo, useState } from 'react'
import { generatePath, useNavigate } from 'react-router'
import { Container, Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'
import InfiniteScroll from 'react-infinite-scroll-component'

import { useInfiniteQueryWithScope, useQueryWithScope } from '~/api/useQueryWithScope'
import { getNextPageParam, usePaginatedData } from '~/api/pagination'
import { getPhoningCampaignQuery, getPhoningCampaignsQuery } from '~/api/phoning'
import { useCurrentDeviceType } from '~/components/shared/device/hooks'
import { useErrorHandler } from '~/components/shared/error/hooks'
import CampaignGlobalKPI from './Campaign/CampaignGlobalKPI'
import CampaignItem from './Campaign/CampaignItem'
import CreateEdit from './CreateEdit/CreateEdit'
import { PageHeaderButton } from '~/ui/PageHeader/PageHeader'
import Loader from '~/ui/Loader'
import PageHeader from '~/ui/PageHeader'
import { useUserScope } from '../../redux/user/hooks'
import { nationalScopes } from '~/shared/scopes'

const Title = styled(Typography)(
  ({ theme }) => `
    margin: ${theme.spacing(1, 0, 2, 1)};
    font-size: 18px;
    font-weight: 400px;
`
)

const infiniteScrollStylesOverrides = {
  '& .infinite-scroll-component__outerdiv': {
    width: '100%',
  },
}

const roles = {
  national: 'national',
  local: 'local',
}

const messages = {
  pageTitle: 'Phoning',
  create: 'Créer une campagne',
  campaigns: 'Campagnes',
  over: 'Terminé',
  ongoing: 'En cours',
  see: 'Voir',
  noPhoningCampaign: 'Aucune campagne à afficher',
}

const Phoning = () => {
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false)
  const [campaignIdToUpdate, setCampaignIdToUpdate] = useState()
  const navigate = useNavigate()
  const { handleError } = useErrorHandler()
  const [currentScope] = useUserScope()
  const { isMobile } = useCurrentDeviceType()
  const isNational = useMemo(() => nationalScopes.includes(currentScope?.code), [currentScope?.code])
  const [KPISalt, setKPISalt] = useState(0)

  const refetchKPIs = () => {
    setKPISalt(prev => prev + 1)
  }

  const {
    data: paginatedCampaigns = null,
    fetchNextPage: fetchNextPageCampaigns,
    hasNextPage: hasNextPageCampaigns,
    refetch: refetchCampaigns,
    isLoading: isPhoningCampaignsLoading,
  } = useInfiniteQueryWithScope(
    ['paginated-campaigns', { feature: 'Phoning', view: 'Phoning' }],
    pageParams => getPhoningCampaignsQuery(pageParams, isNational ? roles.national : roles.local),
    {
      getNextPageParam,
      onError: handleError,
    }
  )
  const campaigns = usePaginatedData(paginatedCampaigns)

  const { data: campaignDetail = {} } = useQueryWithScope(
    [['campaign-detail', { feature: 'Phoning', view: 'Phoning' }], campaignIdToUpdate],
    () => getPhoningCampaignQuery(campaignIdToUpdate),
    {
      enabled: !!campaignIdToUpdate,
      onSuccess: () => {
        setIsCreateEditModalOpen(true)
      },
      onError: handleError,
    }
  )

  const handleView = campaignId => () => {
    navigate(generatePath('/phoning/:campaignId', { campaignId }))
  }

  const handleUpdate = campaignId => () => {
    setCampaignIdToUpdate(campaignId)
  }

  const handleClose = () => {
    setCampaignIdToUpdate(undefined)
    setIsCreateEditModalOpen(false)
  }

  return (
    <Container maxWidth={false} sx={{ mb: 3 }}>
      <Grid container justifyContent="space-between">
        <PageHeader
          title={messages.pageTitle}
          button={
            <PageHeaderButton
              label={messages.create}
              onClick={() => setIsCreateEditModalOpen(true)}
              isMainButton
              data-cy="phoning-create-edit"
            />
          }
        />
      </Grid>

      <Grid container justifyContent="space-between" sx={{ ...(isMobile && { pt: 2 }) }}>
        <CampaignGlobalKPI refreshKPIs={KPISalt} />
      </Grid>

      <Grid
        container
        justifyContent="space-between"
        data-cy="phoning-campaigns-container"
        sx={{ pt: 4, ...infiniteScrollStylesOverrides }}
      >
        <Grid container>
          <Title>{messages.campaigns}</Title>
        </Grid>
        {!isPhoningCampaignsLoading && !campaigns.length && <div>{messages.noPhoningCampaign}</div>}
        {isPhoningCampaignsLoading ? (
          <Loader />
        ) : (
          <InfiniteScroll
            dataLength={campaigns.length}
            next={() => fetchNextPageCampaigns()}
            hasMore={hasNextPageCampaigns}
            loader={<Loader />}
          >
            <Grid container spacing={2} data-cy="phoning-campaigns-list">
              {campaigns.map(campaign => (
                <CampaignItem
                  key={campaign.id}
                  endDate={campaign.endDate}
                  title={campaign.title}
                  author={campaign.author}
                  team={campaign.team}
                  handleView={handleView(campaign.id)}
                  handleUpdate={handleUpdate(campaign.id)}
                  numberOfCalls={campaign.numberOfCalls}
                  numberOfUsersCalled={campaign.numberOfUsersCalled}
                  numberOfUsersToBeCalled={campaign.numberOfUsersToBeCalled}
                />
              ))}
            </Grid>
          </InfiniteScroll>
        )}
      </Grid>

      {isCreateEditModalOpen && (
        <CreateEdit
          campaign={
            Object.keys(campaignDetail).length > 0 ? { id: campaignIdToUpdate, ...campaignDetail.createEdit } : null
          }
          onCreateResolve={() => {
            refetchCampaigns()
            refetchKPIs()
          }}
          handleClose={handleClose}
        />
      )}
    </Container>
  )
}

export default Phoning
