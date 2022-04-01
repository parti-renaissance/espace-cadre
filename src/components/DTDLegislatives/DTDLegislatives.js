import { useState } from 'react'
import { Container, Grid, Typography } from '@mui/material'
import { styled } from '@mui/system'
import PageHeader from 'ui/PageHeader'
import { PageHeaderButton } from 'ui/PageHeader/PageHeader'
import Modal from './Modal'
import CampaignItem from './Campaign/CampaignItem'
import HomepageData from './Data/HomepageData'

const Subtitle = styled(Typography)(
  ({ theme }) => `
  font-size: 18px;
  font-weight: 400;
  color: ${theme.palette.gray800}
`
)

const messages = {
  title: 'Porte à porte législatives',
  create: 'Créer une campagne',
  KPITitle: 'Campagnes de mon territoire',
}

const DTDLegislatives = () => {
  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Container maxWidth="lg">
      <Grid container justifyContent="space-between">
        <PageHeader
          title={messages.title}
          button={<PageHeaderButton label={messages.create} onClick={() => setOpen(true)} isMainButton />}
        />
      </Grid>
      <Grid container sx={{ mb: 2 }}>
        <Subtitle>{messages.KPITitle}</Subtitle>
      </Grid>
      <Grid container spacing={2} data-cy="DTD-campaigns-list">
        {HomepageData.map(campaign => (
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
          />
        ))}
      </Grid>
      {open && <Modal open={open} handleClose={handleClose} />}
    </Container>
  )
}

export default DTDLegislatives
