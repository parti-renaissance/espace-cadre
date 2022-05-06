import { useState } from 'react'
import { generatePath, useNavigate } from 'react-router'
import { Container, Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'
import InfiniteScroll from 'react-infinite-scroll-component'

import PageHeader from 'ui/PageHeader'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import Loader from 'ui/Loader'
import { useErrorHandler } from 'components/shared/error/hooks'
import CreateEditModal from './CreateEditModal'
import CampaignItem from './Campaign/CampaignItem'
import { useInfiniteQueryWithScope } from 'api/useQueryWithScope'
import { getNextPageParam, usePaginatedData } from 'api/pagination'
import { getDTDCampaignsQuery } from 'api/DTD'
import { DTDCampaign } from 'domain/DTD'

const CampaignsTitle = styled(Typography)(
  ({ theme }) => `
  color: ${theme.palette.gray800};
  font-size: 18px;
  line-height: 27px;
`
)

const messages = {
  title: 'Porte à porte local',
  create: 'Créer une campagne',
  campaignsTitle: 'Campagnes de mon territoire',
}

const DTDLegislatives = () => {
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false)
  const [viewingCampaign, setViewingCampaign] = useState(DTDCampaign.NULL)
  const navigate = useNavigate()
  const { handleError } = useErrorHandler()

  const {
    data: paginatedCampaigns = null,
    fetchNextPage: fetchNextPageCampaigns,
    hasNextPage: hasNextPageCampaigns,
    refetch: refetchCampaigns,
  } = useInfiniteQueryWithScope(
    ['paginated-campaigns', { feature: 'DTD', view: 'DTD' }],
    pageParams => getDTDCampaignsQuery(pageParams),
    {
      getNextPageParam,
      onError: handleError,
    }
  )
  const campaigns = usePaginatedData(paginatedCampaigns)

  const handleCreate = () => {
    setViewingCampaign(DTDCampaign.NULL)
    setIsCreateEditModalOpen(true)
  }

  const handleClose = () => {
    setViewingCampaign(DTDCampaign.NULL)
    setIsCreateEditModalOpen(false)
  }

  const handleView = campaignId => () => {
    navigate(generatePath('/porte-a-porte-legislatives/:campaignId', { campaignId }))
  }

  return (
    <Container maxWidth="lg">
      <Grid container justifyContent="space-between">
        <PageHeader
          title={messages.title}
          button={<PageHeaderButton label={messages.create} onClick={handleCreate} isMainButton />}
        />
      </Grid>
      <Grid container mb={2}>
        <CampaignsTitle>{messages.campaignsTitle}</CampaignsTitle>
      </Grid>

      <InfiniteScroll
        dataLength={campaigns.length}
        next={() => fetchNextPageCampaigns()}
        hasMore={hasNextPageCampaigns}
        loader={<Loader />}
      >
        <Grid container spacing={2}>
          {campaigns.map(campaign => (
            <CampaignItem
              key={campaign.id}
              startDate={campaign.startDate}
              endDate={campaign.endDate}
              title={campaign.title}
              author={campaign.author}
              voters={campaign.score.voters}
              pollingStations={campaign.score.pollingStations}
              knockedDoors={campaign.score.knockedDoors}
              count={campaign.score.count}
              collectedContacts={campaign.score.collectedContacts}
              handleView={handleView(campaign.id)}
            />
          ))}
        </Grid>
      </InfiniteScroll>

      {isCreateEditModalOpen && (
        <CreateEditModal
          open={isCreateEditModalOpen}
          handleClose={handleClose}
          campaign={viewingCampaign}
          onCreateResolve={refetchCampaigns}
        />
      )}
    </Container>
  )
}

export default DTDLegislatives
