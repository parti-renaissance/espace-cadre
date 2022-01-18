import { useState } from 'react'
import { generatePath, useNavigate } from 'react-router'
import { Container, Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'
import InfiniteScroll from 'react-infinite-scroll-component'

import { useInfiniteQueryWithScope, useQueryWithScope } from 'api/useQueryWithScope'
import { getNextPageParam, usePaginatedData } from 'api/pagination'
import { getPhoningGlobalKPIQuery, getPhoningCampaignsQuery, getPhoningCampaignQuery } from 'api/phoning'
import { useErrorHandler } from 'components/shared/error/hooks'
import CampaignGlobalKPI from './Campaign/CampaignGlobalKPI'
import CampaignItem from './Campaign/CampaignItem'
import CreateEdit from './CreateEdit/CreateEdit'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import Loader from 'ui/Loader'
import PageHeader from 'ui/PageHeader'
import EditIcon from 'ui/icons/EditIcon'

const PageTitle = styled(Typography)`
  font-size: 24px;
  font-weight: 400;
  line-height: 36px;
`
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

const messages = {
  pageTitle: 'Phoning',
  create: 'Créer une campagne',
  campaigns: 'Campagnes',
  over: 'Terminé',
  ongoing: 'En cours',
  see: 'Voir',
}

const Phoning = () => {
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false)
  const [campaignIdToUpdate, setCampaignIdToUpdate] = useState()
  const navigate = useNavigate()
  const { handleError } = useErrorHandler()

  const { data: globalKPI = {} } = useQueryWithScope('globalKPI', () => getPhoningGlobalKPIQuery(), {
    onError: handleError,
  })

  const {
    data: paginatedCampaigns = null,
    fetchNextPage: fetchNextPageCampaigns,
    hasNextPage: hasNextPageCampaigns,
    refetch: refetchCampaigns,
  } = useInfiniteQueryWithScope('campaigns', pageParams => getPhoningCampaignsQuery(pageParams), {
    getNextPageParam,
    onError: handleError,
  })
  const campaigns = usePaginatedData(paginatedCampaigns)

  const { data: campaignDetail = {} } = useQueryWithScope(
    ['campaign', campaignIdToUpdate],
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
    <Container maxWidth="lg" sx={{ mb: 3 }}>
      <Grid container justifyContent="space-between">
        <PageHeader
          title={<PageTitle sx={{ color: 'campaigncolor' }}>{messages.pageTitle}</PageTitle>}
          button={
            <PageHeaderButton
              label={messages.create}
              icon={<EditIcon sx={{ color: 'campaign.color', fontSize: '20px' }} />}
              onClick={() => setIsCreateEditModalOpen(true)}
            />
          }
        />
      </Grid>

      <Grid container justifyContent="space-between">
        {Object.keys(globalKPI).length > 0 && (
          <CampaignGlobalKPI campaigns={globalKPI.campaigns} surveys={globalKPI.surveys} calls={globalKPI.calls} />
        )}
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

        {campaigns.length > 0 && (
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
                  score={campaign.score}
                  handleView={handleView(campaign.id)}
                  handleUpdate={handleUpdate(campaign.id)}
                />
              ))}
            </Grid>
          </InfiniteScroll>
        )}
      </Grid>

      {isCreateEditModalOpen && (
        <CreateEdit
          campaign={Object.keys(campaignDetail).length > 0 ? campaignDetail.createEdit : null}
          onCreateResolve={refetchCampaigns}
          handleClose={handleClose}
        />
      )}
    </Container>
  )
}

export default Phoning
