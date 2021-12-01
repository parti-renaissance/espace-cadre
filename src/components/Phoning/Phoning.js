import { Container, Grid } from '@mui/material'
import PageHeader from 'ui/PageHeader'

const messages = {
  title: 'Phoning',
  actionButtonText: 'Créer une campagne',
}

const Phoning = () => {
  const handleNewCampaign = () => {}

  return (
    <Container maxWidth="xl">
      <Grid container justifyContent="space-between">
        <PageHeader
          title={messages.title}
          message={messages.actionButtonText}
          parentStyles={{ color: '#4338CA', background: 'rgba(67, 56, 202, 0.08)' }}
          handleAction={handleNewCampaign}
        />
      </Grid>
    </Container>
  )
}

export default Phoning
