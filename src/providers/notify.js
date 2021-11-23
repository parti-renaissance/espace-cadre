import PropTypes from 'prop-types'
import { SnackbarProvider } from 'notistack'

const NotifyProvider = ({ children }) => (
  <SnackbarProvider
    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    transitionDuration={{ enter: 300, exit: 500 }}
    autoHideDuration={3000}
    maxSnack={5}
    preventDuplicate
  >
    {children}
  </SnackbarProvider>
)

NotifyProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default NotifyProvider
