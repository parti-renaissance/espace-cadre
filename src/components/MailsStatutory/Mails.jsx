import { useState } from 'react'
import { Box, Container, Grid } from '@mui/material'
import GridViewIcon from '@mui/icons-material/GridView'
import { useCurrentDeviceType } from 'components/shared/device/hooks'
import Templates from 'components/Messagerie/Templates'
import SentEmailCampaigns from 'components/Dashboard/Charts/SentEmailCampaigns/SentEmailCampaigns'
import PageHeader, { PageHeaderButton } from 'ui/PageHeader/PageHeader'

const Mails = () => {
  const [showTemplates, setShowTemplates] = useState(false)
  const { isMobile } = useCurrentDeviceType()

  return (
    <Container maxWidth={false} sx={{ mb: 3 }}>
      <Grid container justifyContent="space-between" sx={{ mb: isMobile ? 2 : null }}>
        <PageHeader
          title="Mails statutaires"
          button={
            <Box display="flex" alignItems="center" className="space-x-3">
              <PageHeaderButton
                onClick={() => setShowTemplates(true)}
                label="Modèles"
                icon={<GridViewIcon />}
                data-cy="templates-button"
                isMainButton
              />
            </Box>
          }
        />
      </Grid>

      <Grid container>
        <Grid item xs={12}>
          <SentEmailCampaigns isMailsStatutory />
        </Grid>
      </Grid>

      {showTemplates && <Templates isMailsStatutory handleClose={() => setShowTemplates(false)} />}
    </Container>
  )
}

export default Mails
