import ErrorComponent from 'components/ErrorComponent'
import * as Sentry from '@sentry/react'
import PropTypes from 'prop-types'
import { APP_ENVIRONMENT } from 'shared/environments'
import { useSelector } from 'react-redux'
import { getCurrentScope, getCurrentUser } from '../redux/user/selectors'
import { configureScope } from '@sentry/react'

const ErrorBoundary = ({ children }) => {
  const currentScope = useSelector(getCurrentScope)
  const currentUser = useSelector(getCurrentUser)

  if (currentUser) {
    configureScope(scope => {
      scope.setUser({
        email: currentUser.emailAddress,
        username: `${currentUser.firstName} ${currentUser.lastName}`,
        scope: currentScope?.code,
      })
    })
  }

  return (
    <Sentry.ErrorBoundary
      fallback={
        <ErrorComponent errorMessage={{ message: "Une erreur est survenue, merci de relancer l'application." }} />
      }
      showDialog={APP_ENVIRONMENT === 'staging'}
    >
      {children}
    </Sentry.ErrorBoundary>
  )
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ErrorBoundary
