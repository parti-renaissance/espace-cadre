import { useState } from 'react'
import { generatePath, useNavigate } from 'react-router'
import { Container, Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'
import InfiniteScroll from 'react-infinite-scroll-component'

import { useInfiniteQueryWithScope, useQueryWithScope } from 'api/useQueryWithScope'
import { getNextPageParam, usePaginatedData } from 'api/pagination'
import { getPhoningGlobalKPIQuery, getPhoningCampaignListQuery, getPhoningCampaignQuery } from 'api/phoning'
import { useErrorHandler } from 'components/shared/error/hooks'
import CampaignGlobalKPI from './Campaign/CampaignGlobalKPI'
import CampaignListItem from './Campaign/CampaignListItem'
import CreateEdit from './CreateEdit/CreateEdit'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import Loader from 'ui/Loader'
import PageHeader from 'ui/PageHeader'
import EditIcon from 'ui/icons/EditIcon'

const Title = styled(Typography)(
  ({ theme }) => `
    margin: ${theme.spacing(1, 0, 2, 1)};
    font-size: 18px;
    font-weight: 400px;
`
)

const messages = {
  title: 'Phoning',
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
    data: paginatedCampaignList = null,
    fetchNextPage: fetchNexPageCampaignList,
    hasNextPage: hasNextPageCampaignList,
    refetch: refetchCampaignList,
  } = useInfiniteQueryWithScope('campaignList', pageParams => getPhoningCampaignListQuery(pageParams), {
    getNextPageParam,
    onError: handleError,
  })
  const campaignList = usePaginatedData(paginatedCampaignList)

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
          title={messages.title}
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

      <Grid container justifyContent="space-between" sx={{ pt: 4 }}>
        <Grid container>
          <Title data-testid="Campaigns-list-title">{messages.campaigns}</Title>
        </Grid>

        {campaignList.length > 0 && (
          <InfiniteScroll
            dataLength={history.length}
            next={() => fetchNexPageCampaignList()}
            hasMore={hasNextPageCampaignList}
            loader={<Loader />}
          >
            <Grid container spacing={2}>
              {campaignList.map(campaign => (
                <CampaignListItem
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

      <CreateEdit
        campaign={Object.keys(campaignDetail).length > 0 ? campaignDetail.createEdit : null}
        isOpen={isCreateEditModalOpen}
        onCreateResolve={refetchCampaignList}
        handleClose={handleClose}
      />
    </Container>
  )
}

export default Phoning
