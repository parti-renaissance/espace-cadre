import { useState } from 'react'
import { Container, Grid, Typography, Tabs, Tab as MuiTab } from '@mui/material'
import { styled } from '@mui/system'
import PageHeader from 'ui/PageHeader'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import Modal from './Modal'
import CampaignItem from './Campaign/CampaignItem'
import HomepageData from './Data/HomepageData'
import { generatePath, useNavigate } from 'react-router'

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
  create: 'Créer une campagne',
  cartography: 'Cartographie',
  campaigns: 'Campagnes de mon territoire',
}

const DTDLegislatives = () => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState(messages.cartography)

  const handleClose = () => {
    setOpen(false)
  }

  const handleTabChange = (_, tabId) => {
    setSelectedTab(tabId)
  }

  const handleView = campaignId => () => {
    navigate(generatePath('/porte-a-porte-legislatives/:campaignId', { campaignId }))
  }

  return (
    <Container maxWidth="lg">
      <Grid container justifyContent="space-between">
        <PageHeader
          title={messages.title}
          button={<PageHeaderButton label={messages.create} onClick={() => setOpen(true)} isMainButton />}
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
      <Grid container spacing={2}>
        {selectedTab === messages.campaigns &&
          HomepageData.map(campaign => (
            <CampaignItem
              key={campaign.id}
              startDate={campaign.startDate}
              endDate={campaign.endDate}
              title={campaign.title}
              author={campaign.author}
              voters={campaign.voters}
              pollingStations={campaign.pollingStations}
              knockedDoors={campaign.knockedDoors}
              filledSurveys={campaign.filledSurveys}
              collectedContacts={campaign.collectedContacts}
              handleView={handleView(campaign.id)}
            />
          ))}
      </Grid>
      {open && <Modal open={open} handleClose={handleClose} />}
    </Container>
  )
}

export default DTDLegislatives
