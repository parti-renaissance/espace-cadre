import { Alert } from '@mui/material'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'

const useStyles = makeStyles(theme => ({
  errorMessage: {
    color: theme.palette.statusError,
    background: theme.palette.backgroundError,
    borderRadius: '8px',
    elevation: 'none',
    alignItems: 'center',
  },
}))

function AlertBanner({ severity, message }) {
  const classes = useStyles()

  if (!message) return null

  return (
    <Alert className={classes.errorMessage} elevation={0} variant="filled" severity={severity}>
      {typeof message === 'object' ? message.message : message}
    </Alert>
  )
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
