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
import SignupConfirm from 'components/Signup/SignupConfirm'
import LegalContainer from '../Signup/components/LegalContainer'
import { PPD, CGUWeb, CGUMobile, CookiesWeb, CookiesMobile } from '../Signup/constants'

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
  if (pathname === paths.signupConfirm) return <SignupConfirm />
  if (pathname === paths.ppd) return <LegalContainer type={PPD} />
  if (pathname === paths.cguWeb) return <LegalContainer type={CGUWeb} />
  if (pathname === paths.cguMobile) return <LegalContainer type={CGUMobile} />
  if (pathname === paths.cookiesWeb) return <LegalContainer type={CookiesWeb} />
  if (pathname === paths.cookiesMobile) return <LegalContainer type={CookiesMobile} />
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
