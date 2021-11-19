import { Grid } from '@mui/material'

import { makeStyles } from '@mui/styles'
import createStyles from '@mui/styles/createStyles'

const useStyles = makeStyles(theme =>
  createStyles({
    campaignListTitle: {
      color: theme.palette.blackCorner,
      fontWeight: '600',
      fontSize: '20px',
      marginBottom: theme.spacing(2),
    },
  })
)

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
