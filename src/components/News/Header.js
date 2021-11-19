import { Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import NotificationsOffRoundedIcon from '@mui/icons-material/NotificationsOffRounded'

const useStyles = makeStyles(theme => ({
  container: {
    marginBottom: theme.spacing(1),
  },
  chip: {
    fontSize: '10px',
    fontWeight: '500',
    borderRadius: '19px',
    padding: theme.spacing(0.25, 1),
  },
  withBorder: {
    border: `1px solid ${theme.palette.gray200}`,
  },
  icon: {
    fontSize: '16px',
    margin: theme.spacing(0.25, 0, 0, 1),
  },
  active: {
    color: theme.palette.teal700,
    background: theme.palette.activeLabel,
    borderRadius: '19px',
  },
  inactive: {
    color: theme.palette.red600,
    background: theme.palette.inactiveLabel,
  },
  date: {
    fontSize: '10px',
    color: theme.palette.gray600,
    padding: theme.spacing(1),
  },
}))

const messages = {
  published: 'Publiée',
  unpublished: 'Dépubliée',
}

const Header = ({ status = false, withNotification = false, createdAt = null }) => {
  const classes = useStyles()
  const NotificationIcon = withNotification ? NotificationsActiveRoundedIcon : NotificationsOffRoundedIcon

  return (
    <Grid container className={classes.container}>
      <Grid item>
        {status ? (
          <span className={`${classes.chip} ${classes.active}`}>{messages.published}</span>
        ) : (
          <span className={`${classes.chip} ${classes.inactive}`}>{messages.unpublished}</span>
        )}
      </Grid>
      <Grid item>
        <NotificationIcon className={`${classes.chip} ${classes.withBorder} ${classes.icon}`} />
      </Grid>
      <Grid item className={classes.date}>
        Le {new Date(createdAt).toLocaleDateString()}
      </Grid>
    </Grid>
  )
}

Header.propTypes = {
  status: PropTypes.bool.isRequired,
  withNotification: PropTypes.bool.isRequired,
  createdAt: PropTypes.string.isRequired,
}

export default Header
