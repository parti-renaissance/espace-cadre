import { Grid, Typography as MuiTypography } from '@mui/material'
import { styled } from '@mui/system'

const Typography = styled(MuiTypography)`
  color: ${({ theme }) => theme.palette.blackCorner};
  font-size: 20px;
  font-weight: 600;
`

const messages = {
  campaigns: 'Vos dernières campagnes',
}

const SentEmailCampaignsTitle = () => (
  <Grid container sx={{ mb: 2 }}>
    <Grid item xs={12}>
      <Typography>{messages.campaigns}</Typography>
    </Grid>
  </Grid>
)

export default SentEmailCampaignsTitle
