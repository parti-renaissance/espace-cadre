import { Grid, Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import NotificationsOffRoundedIcon from '@mui/icons-material/NotificationsOffRounded'
import PropTypes from 'prop-types'
import Riposte from 'domain/riposte'
import pluralize from 'components/shared/pluralize/pluralize'

const useStyles = makeStyles(theme => ({
  chip: {
    fontSize: '10px',
    fontWeight: '500',
    borderRadius: '19px',
    padding: theme.spacing(0.25, 1),
    border: `1px solid ${theme.palette.gray200}`,
  },
  icon: {
    fontSize: '17px',
  },
  buttonContainer: {
    position: 'relative',
    bottom: '0',
  },
}))

const messages = {
  view: 'vue',
  detailed: 'détaillée',
  riposte: 'riposte',
}

const Content = ({ riposte }) => {
  const classes = useStyles()
  const { withNotification, views, detailViews, ripostes } = riposte
  const NotificationIcon = withNotification ? NotificationsActiveRoundedIcon : NotificationsOffRoundedIcon

  return (
    <Grid container spacing={1}>
      <Grid item>
        <NotificationIcon className={`${classes.chip} ${classes.icon}`} />
      </Grid>
      <Grid item>
        <Box className={`${classes.chip}`}>
          {views} {pluralize(views, messages.view)}
        </Box>
      </Grid>
      <Grid item>
        <Box className={`${classes.chip}`}>
          {detailViews} {pluralize(detailViews, messages.view)} {pluralize(detailViews, messages.detailed)}
        </Box>
      </Grid>
      <Grid item>
        <Box className={`${classes.chip}`}>
          {ripostes} {pluralize(ripostes, messages.riposte)}
        </Box>
      </Grid>
    </Grid>
  )
}

Content.propTypes = {
  riposte: Riposte.propTypes.isRequired,
  handleEdit: PropTypes.func.isRequired,
  toggleStatus: PropTypes.func.isRequired,
}

export default Content
