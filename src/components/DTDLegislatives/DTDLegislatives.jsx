import { useState, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { generatePath, useNavigate } from 'react-router'
import { Container, Grid, Typography, Tabs, Tab as MuiTab } from '@mui/material'
import { styled } from '@mui/system'
import InfiniteScroll from 'react-infinite-scroll-component'

import PageHeader from '~/ui/PageHeader'
import { PageHeaderButton } from '~/ui/PageHeader/PageHeader'
import Loader from '~/ui/Loader'
import { useCustomSnackbar } from '~/components/shared/notification/hooks'
import { useErrorHandler } from '~/components/shared/error/hooks'
import { notifyVariants } from '~/components/shared/notification/constants'
import CreateEditModal from './CreateEditModal'
import CampaignItem from './Campaign/CampaignItem'
import LegendItem from '../DTD/LegendItem'
import Map from './Map'
import { useInfiniteQueryWithScope } from '~/api/useQueryWithScope'
import { getNextPageParam, usePaginatedData } from '~/api/pagination'
import { getDTDCampaignsQuery, deleteDTDCampaignQuery, toggleActivateCampaign } from '~/api/DTD'
import { DTDCampaign } from '~/domain/DTD'
import MapContext from '~/providers/context'

const Legend = styled(Grid)(
  ({ theme }) => `
    padding: 16px;
    margin-bottom: ${theme.spacing(2)};
    background: ${theme.palette.whiteCorner};
  `
)

const Tab = styled(MuiTab)(({ theme }) => ({
  textTransform: 'none',
  color: theme.palette.gray400,
  '&.Mui-selected': {
    color: theme.palette.gray800,
  },
}))

const TabLabel = styled(Typography)`
  font-size: 18px;
  font-size: 18px;
  font-weight: 400;
  line-height: 27px;
`

const messages = {
  title: 'Porte à porte local',
  create: 'Créer une campagne',
  cartography: 'Cartographie',
  campaignsTitle: 'Campagnes de mon territoire',
  campaigns: 'Campagnes de mon territoire',
  legendTitle: 'Recommandations pour le porte à porte',
  legendPrefix: 'Sur cette carte, retrouvez les recommandations du Porte à porte.',
  legend: [
    {
      title: 'Les bureaux verts ',
      main1: "En vert les zones les plus favorables à l'électorat de la majorité présidentielle.",
      subtitle: "Plus le vert est foncé (5 variations), plus le potentiel d'électeurs est élevé.",
      color: 'green',
    },
    {
      title: 'Les bureaux rouge ',
      main1: "En rouge les zones les moins favorables à l'électorat de la majorité présidentielle.",
      subtitle: "Plus le rouge est foncé (5 variations), plus le potentiel d'électeurs est faible.",
      color: 'red',
    },
  ],
  deleteSuccess: 'Campagne supprimée avec succès',
  publishSuccess: 'Campagne publiée avec succès',
  unpublishSuccess: 'Campagne dépubliée avec succès',
}

const DTDLegislatives = () => {
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false)
  const [pollingStationSelection, setPollingStationSelection] = useState([])
  const [viewingCampaign, setViewingCampaign] = useState(DTDCampaign.NULL)
  const navigate = useNavigate()
  const { handleError } = useErrorHandler()
  const { enqueueSnackbar } = useCustomSnackbar()
  const [selectedTab, setSelectedTab] = useState(messages.cartography)
  const value = { pollingStationSelection, setPollingStationSelection }

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

  const { mutate: deleteDTDCampaign } = useMutation(deleteDTDCampaignQuery, {
    onSuccess: () => {
      enqueueSnackbar(messages.deleteSuccess, notifyVariants.success)
      refetchCampaigns()
    },
    onError: handleError,
  })

  const { mutateAsync: updateCampaign } = useMutation(toggleActivateCampaign, {
    onSuccess: async isPublished => {
      enqueueSnackbar(isPublished ? messages.publishSuccess : messages.unpublishSuccess, notifyVariants.success)
      await refetchCampaigns()
    },
    onError: handleError,
  })

  const handleCreate = () => {
    setViewingCampaign(DTDCampaign.NULL)
    setIsCreateEditModalOpen(true)
  }

  const handleDelete = useCallback(
    campaignId => () => {
      deleteDTDCampaign(campaignId)
    },
    [deleteDTDCampaign]
  )

  const handleClose = () => {
    setViewingCampaign(DTDCampaign.NULL)
    setIsCreateEditModalOpen(false)
  }

  const handleTabChange = (_, tabId) => {
    setSelectedTab(tabId)
  }

  const handleView = campaignId => () => {
    navigate(generatePath('/porte-a-porte-legislatives/:campaignId', { campaignId }))
  }

  const togglePublish = campaign => () => {
    const { id, isPublished } = campaign
    updateCampaign({ id, isPublished: !isPublished })
  }
  return (
    <MapContext.Provider value={value}>
      <Container maxWidth={false}>
        <Grid container justifyContent="space-between">
          <PageHeader
            title={messages.title}
            button={<PageHeaderButton label={messages.create} onClick={handleCreate} isMainButton />}
          />
        </Grid>
        <Grid container data-cy="DTD-campaigns-list">
          <Tabs
            variant="scrollable"
            value={selectedTab}
            onChange={handleTabChange}
            TabIndicatorProps={{ sx: { bgcolor: 'indigo700' } }}
            sx={{ my: 2 }}
          >
            <Tab
              value={messages.cartography}
              label={<TabLabel>{messages.cartography}</TabLabel>}
              disableRipple
              disableFocusRipple
            />
            <Tab
              value={messages.campaigns}
              label={<TabLabel>{messages.campaigns}</TabLabel>}
              disableRipple
              disableFocusRipple
            />
          </Tabs>
        </Grid>
        {selectedTab === messages.cartography && (
          <Grid container sx={{ borderRadius: '12px', background: 'white', p: 1 }}>
            <Grid item xs={12} md={6}>
              <Legend container>
                <Typography variant="subtitle1" sx={{ mb: 3 }}>
                  {messages.legendTitle}
                </Typography>
                <Grid container>
                  <Grid item sx={{ mb: 2 }}>
                    {messages.legendPrefix}
                  </Grid>
                  {messages.legend.map((el, i) => (
                    <LegendItem
                      key={i}
                      title={el?.title}
                      main1={el?.main1}
                      main2={el?.main2}
                      subtitle={el?.subtitle}
                      color={el?.color}
                    />
                  ))}
                  <Grid item>{messages.legendSuffix}</Grid>
                </Grid>
              </Legend>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                background: 'white',
                p: 2,
                height: '600px',
              }}
            >
              <Map currentStep={0} />
            </Grid>
          </Grid>
        )}
        {selectedTab === messages.campaigns && campaigns.length > 0 && (
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
                  isPublished={campaign.isPublished}
                  handleView={handleView(campaign.id)}
                  handleDelete={handleDelete(campaign.id)}
                  handlePublish={togglePublish(campaign)}
                />
              ))}
            </Grid>
          </InfiniteScroll>
        )}
        {isCreateEditModalOpen && (
          <CreateEditModal
            open={isCreateEditModalOpen}
            handleClose={handleClose}
            campaign={viewingCampaign}
            onCreateResolve={refetchCampaigns}
          />
        )}
      </Container>
    </MapContext.Provider>
  )
}

export default DTDLegislatives
