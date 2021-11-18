import { Grid, makeStyles, Box, Button } from '@material-ui/core'
import RiposteEnableStatus from './RiposteEnableStatus'
import NotificationsActiveRoundedIcon from '@material-ui/icons/NotificationsActiveRounded'
import NotificationsOffRoundedIcon from '@material-ui/icons/NotificationsOffRounded'
import PropTypes from 'prop-types'

const messages = {
  edit: 'Éditer',
}

const useStyles = makeStyles(theme => ({
  KpiContainer: {
    marginBottom: theme.spacing(2.5),
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
    fontSize: '17px',
  },
  buttonContainer: {
    position: 'relative',
    bottom: '0',
  },
  editButton: {
    fontSize: '13px',
    fontWeight: '500',
    color: theme.palette.teal700,
    marginTop: theme.spacing(1.5),
    '&:hover': {
      background: theme.palette.riposteBackground,
      borderRadius: '8.35px',
    },
  },
}))

const Body = ({ id, status, withNotification, views, detailViews, ripostes, handleClickOpen, toggleStatus }) => {
  const classes = useStyles()
  const NotificationIcon = withNotification ? NotificationsActiveRoundedIcon : NotificationsOffRoundedIcon

  return (
    <>
      <Grid container spacing={1} className={classes.KpiContainer}>
        <Grid item>
          <NotificationIcon className={`${classes.chip} ${classes.withBorder} ${classes.icon}`} />
        </Grid>
        <Grid item>
          <Box className={`${classes.chip} ${classes.withBorder}`}>
            {views} vue{views > 1 && 's'}
          </Box>
        </Grid>
        <Grid item>
          <Box className={`${classes.chip} ${classes.withBorder}`}>
            {detailViews} vue{detailViews > 1 && 's'} détaillée{detailViews > 1 && 's'}
          </Box>
        </Grid>
        <Grid item>
          <Box className={`${classes.chip} ${classes.withBorder}`}>
            {ripostes} riposte{ripostes > 1 && 's'}
          </Box>
        </Grid>
      </Grid>
      <Grid container justifyContent="space-between" className={classes.buttonContainer}>
        <Grid item>
          <Button className={classes.editButton} onClick={() => handleClickOpen(id)}>
            {messages.edit}
          </Button>
        </Grid>
        <Grid item>
          <RiposteEnableStatus id={id} status={status} toggleStatus={toggleStatus} />
        </Grid>
      </Grid>
    </>
  )
}

Body.propTypes = {
  id: PropTypes.string.isRequired,
  status: PropTypes.bool.isRequired,
  withNotification: PropTypes.bool.isRequired,
  views: PropTypes.number.isRequired,
  detailViews: PropTypes.number.isRequired,
  ripostes: PropTypes.number.isRequired,
  handleClickOpen: PropTypes.func.isRequired,
  toggleStatus: PropTypes.func.isRequired,
}

export default Body
