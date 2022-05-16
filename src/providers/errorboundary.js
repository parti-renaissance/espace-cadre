import ErrorComponent from 'components/ErrorComponent'
import * as Sentry from '@sentry/react'
import PropTypes from 'prop-types'
import { APP_ENVIRONMENT } from 'shared/environments'

const ErrorBoundary = ({ children }) => (
  <Sentry.ErrorBoundary
    fallback={
      <ErrorComponent errorMessage={{ message: "Une erreur est survenue, merci de relancer l'application." }} />
    }
    showDialog={APP_ENVIRONMENT === 'staging'}
  >
    {children}
  </Sentry.ErrorBoundary>
)

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ErrorBoundary
