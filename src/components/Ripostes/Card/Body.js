import { Grid, Box, Button } from '@mui/material'
import { makeStyles } from '@mui/styles'
import RiposteStatus from './RiposteStatus'
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import NotificationsOffRoundedIcon from '@mui/icons-material/NotificationsOffRounded'
import PropTypes from 'prop-types'
import Riposte from 'domain/riposte'

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

const Body = ({ riposte, handleClickOpen, toggleStatus }) => {
  const classes = useStyles()
  const { id, status, withNotification, views, detailViews, ripostes } = riposte
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
          <RiposteStatus id={id} status={status} toggleStatus={toggleStatus} />
        </Grid>
      </Grid>
    </>
  )
}

Body.propTypes = {
  riposte: Riposte.propTypes.isRequired,
  handleClickOpen: PropTypes.func.isRequired,
  toggleStatus: PropTypes.func.isRequired,
}

export default Body
