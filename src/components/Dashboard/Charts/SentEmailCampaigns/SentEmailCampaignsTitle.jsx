import { Grid, Typography as MuiTypography } from '@mui/material'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'

const Typography = styled(MuiTypography)`
  color: ${({ theme }) => theme.palette.blackCorner};
  font-size: 20px;
  font-weight: 600;
`

const messages = {
  campaigns: 'Vos dernières campagnes',
  mails: 'Vos derniers emails',
}

const SentEmailCampaignsTitle = ({ isMailsStatutory = false }) => (
  <Grid container sx={{ mb: 2 }}>
    <Grid item xs={12}>
      <Typography>{isMailsStatutory ? messages.mails : messages.campaigns}</Typography>
    </Grid>
  </Grid>
)

export default SentEmailCampaignsTitle

SentEmailCampaignsTitle.propTypes = {
  isMailsStatutory: PropTypes.bool,
}
