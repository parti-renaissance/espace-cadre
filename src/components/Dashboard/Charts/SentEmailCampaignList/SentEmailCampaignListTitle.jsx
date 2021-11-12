import { Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(theme => ({
  campaignListTitle: {
    color: theme.palette.blackCorner,
    fontWeight: '600',
    fontSize: '20px',
    marginBottom: '16px',
  },
}))

function SentEmailCampaignListTitle() {
  const classes = useStyles()
  return (
    <Grid container className={classes.campaignListTitle}>
      <Grid item xs={12}>
        Vos dernières campagnes
      </Grid>
    </Grid>
  )
}

export default SentEmailCampaignListTitle
