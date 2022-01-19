import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { isUserLogged, getUserScopes, getCurrentUser } from '../../redux/user/selectors'
import { useGetUserData, useInitializeAuth } from '../../redux/auth/hooks'
import { useUserScope } from '../../redux/user/hooks'
import ScopesPage from 'components/Scopes/ScopesPage'
import BootPage from 'components/BootPage'
import Auth from 'components/Auth'
import Sidebar from 'components/Sidebar/Sidebar'
import paths from 'shared/paths'
import ErrorBoundary from '../../providers/errorboundary'
import Signup from 'components/Signup/Signup'
import CGU from 'components/Signup/Cgu'
import PPD from 'components/Signup/Ppd'

const publicPaths = [paths.cgu, paths.signup, paths.auth, paths.ppd]

const Layout = ({ children }) => {
  const initializeAuth = useInitializeAuth()
  const { pathname } = useLocation()
  const isUserLoggedIn = useSelector(isUserLogged)
  const currentUser = useSelector(getCurrentUser)
  const [currentScope] = useUserScope()
  const userScopes = useSelector(getUserScopes)
  const [, updateUserData] = useGetUserData()

  useEffect(() => {
    if (isUserLoggedIn) {
      if (currentUser === null) {
        updateUserData()
      }
    } else if (!publicPaths.includes(pathname)) {
      initializeAuth()
    }
  }, [currentUser, initializeAuth, isUserLoggedIn, pathname, updateUserData])

  if (pathname === paths.auth) return <Auth />
  if (pathname === paths.signup) return <Signup />
  if (pathname === paths.cgu) return <CGU />
  if (pathname === paths.ppd) return <PPD />
  if (!currentUser || userScopes.length === 0) return <BootPage />
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
