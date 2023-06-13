import { Alert as MuiAlert } from '@mui/material'
import { styled } from '@mui/system'
import PropTypes from 'prop-types'

const Alert = styled(MuiAlert)(
  ({ theme }) => `
  color: ${theme.palette.statusError};
  background: ${theme.palette.backgroundError};
  border-radius: 8px;
  elevation: none;
  align-items: center;
  `
)

function AlertBanner({ severity, message }) {
  if (!message) {
    return null
  }

  return (
    <Alert elevation={0} variant="filled" severity={severity}>
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
