import { useState } from 'react'
import { Container, Grid, Tab as MuiTab, Tabs, Typography } from '@mui/material'
import { styled } from '@mui/system'
import PageHeader from 'ui/PageHeader'
import paths from 'shared/paths'
import { useParams } from 'react-router'
import HomepageData from '../Data/HomepageData'
import DTDData from '../Data/DTDData'
import CampaignDetailKPI from './CampaignDetailKpi'
import CampaignDetailDTD from './CampaignDetailDTD'
import pluralize from 'components/shared/pluralize/pluralize'

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

const DTDCampaignDetail = () => {
  const { campaignId } = useParams()
  const campaignDataToFill = HomepageData.find(campaign => campaign.id === campaignId)
  const [campaignData] = useState(campaignDataToFill || {})
  const [selectedTab, setSelectedTab] = useState(messages.dtdSuffix.id)

  const handleTabChange = (_, tabId) => {
    setSelectedTab(tabId)
  }

  return (
    <Container maxWidth="lg">
      <Grid container justifyContent="space-between">
        <PageHeader title={messages.title} titleLink={paths.pap_v2} titleSuffix={campaignData.title} />
      </Grid>
      <Grid container justifyContent="space-between">
        <CampaignDetailKPI campaignData={campaignData} />
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
                    `${DTDData.length} ${messages.dtdPrefix}${pluralize(DTDData.length, label)}`}
                  {id === messages.surveys.id && `${0} ${label}`}
                </TabLabel>
              }
              disableRipple
              disableFocusRipple
            />
          ))}
        </Tabs>
        {selectedTab === messages.dtdSuffix.id && DTDData.length > 0 && (
          <Grid container spacing={2}>
            {DTDData.map((dtd, index) => (
              <CampaignDetailDTD
                key={index + 1}
                number={index + 1}
                author={dtd.author}
                count={dtd.count}
                goal={dtd.goal}
              />
            ))}
          </Grid>
        )}
      </Grid>
    </Container>
  )
}

export default DTDCampaignDetail
