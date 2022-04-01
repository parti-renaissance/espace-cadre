import { Container, Grid } from '@mui/material'
import PageHeader from 'ui/PageHeader'
import paths from 'shared/paths'
import { useParams } from 'react-router'
import HomepageData from '../Data/HomepageData'
import CampaignDetailKPI from './CampaignDetailKpi'

const messages = {
  title: 'Porte à porte législatives',
}

const DTDCampaignDetail = () => {
  const { campaignId } = useParams()
  const campaignData = HomepageData.find(campaign => campaign.id === campaignId)

  return (
    <Container maxWidth="lg">
      <Grid container justifyContent="space-between">
        <PageHeader title={messages.title} titleLink={paths.pap_v2} titleSuffix={campaignData?.title} />
      </Grid>
      <Grid container justifyContent="space-between">
        <CampaignDetailKPI campaignData={campaignData} />
      </Grid>
    </Container>
  )
}

export default DTDCampaignDetail
