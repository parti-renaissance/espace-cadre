import { useSelector } from 'react-redux'
import { useLocation, Navigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { getCurrentUser, getUserScopes, isUserLogged } from '../../redux/user/selectors'
import { useUserScope } from '../../redux/user/hooks'
import ScopesPage from 'components/Scopes/ScopesPage'
import Login from 'components/Login/Login'
import Sidebar from 'components/Sidebar/Sidebar'
import paths from 'shared/paths'
import ErrorBoundary from '../../providers/errorboundary'

const Layout = ({ children }) => {
  const { pathname } = useLocation()
  const isUserLoggedIn = useSelector(isUserLogged)
  const currentUser = useSelector(getCurrentUser)
  const [currentScope] = useUserScope()
  const userScopes = useSelector(getUserScopes)

  if (pathname === paths.auth) return <Login />
  if (!currentUser || !isUserLoggedIn) return <Navigate to={paths.auth} replace={true} />
  if (userScopes && currentScope === null) return <ScopesPage />

  return (
    <Sidebar>
      <ErrorBoundary>{children}</ErrorBoundary>
    </Sidebar>
  )
}

export default Layout

Layout.propTypes = {
  children: PropTypes.instanceOf(Object).isRequired,
}
