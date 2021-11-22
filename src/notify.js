import PropTypes from 'prop-types'
import { SnackbarProvider } from 'notistack'

const NotifyProvider = ({ children }) => {
  const position = { vertical: 'top', horizontal: 'right' }
  return (
    <SnackbarProvider anchorOrigin={position} autoHideDuration={2000} maxSnack={3}>
      {children}
    </SnackbarProvider>
  )
}

NotifyProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default NotifyProvider
