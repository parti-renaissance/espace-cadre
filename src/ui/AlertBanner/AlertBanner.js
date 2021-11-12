import Alert from '@mui/material/Alert'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'

const useStyles = makeStyles(theme => ({
  errorMessage: {
    color: theme.palette.statusError,
    background: theme.palette.backgroundError,
    borderRadius: '8.35px',
    elevation: 'none',
  },
}))

function AlertBanner({ severity, message }) {
  const classes = useStyles()

  const formatMessage = () => {
    if (message && typeof message === 'object') {
      return (
        <Alert className={classes.errorMessage} elevation={0} variant="filled" severity={severity}>
          {message.message}
        </Alert>
      )
    }
    return (
      <Alert className={classes.errorMessage} elevation={0} variant="filled" severity={severity}>
        {message}
      </Alert>
    )
  }

  return <>{message && formatMessage()}</>
}

export default AlertBanner

AlertBanner.propTypes = {
  severity: PropTypes.string.isRequired,
  message: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.shape({
      message: PropTypes.string.isRequired,
    }),
  ]).isRequired,
}
