import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Route, useLocation, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import PropTypes from 'prop-types'
import { getCurrentUser, getUserScopes, isUserLogged } from '../../redux/user/selectors'
import { useGetUserData, useInitializeAuth } from '../../redux/auth/hooks'
import { useUserScope } from '../../redux/user/hooks'
import ScopesPage from '~/components/Scopes/ScopesPage'
import BootPage from '~/components/BootPage'
import Auth from '~/components/Auth'
import { publicPaths } from '~/shared/paths'
import Signup from '~/components/Signup/Signup'
import SignupConfirm from '~/components/Signup/SignupConfirm'
import LegalContainer from '../Signup/components/LegalContainer'
import { CGUMobile, CGUWeb, CookiesMobile, CookiesWeb, Ppd } from '../Signup/constants'
import Sidebar from '~/components/Layout/Sidebar'
import Logout from '../Logout/Logout'
const publicPathsArray = [
  publicPaths.signup,
  publicPaths.auth,
  publicPaths.ppd,
  publicPaths.cguWeb,
  publicPaths.cguMobile,
  publicPaths.cookiesWeb,
  publicPaths.cookiesMobile,
]

const PrivatePages = ({ children }) => {
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
    } else if (!publicPathsArray.includes(pathname)) {
      initializeAuth()
    }
  }, [currentUser, initializeAuth, isUserLoggedIn, pathname, updateUserData])

  if (!currentUser || userScopes.length === 0) {
    return <BootPage />
  }
  if (userScopes && currentScope === null) {
    return <ScopesPage />
  }

  return <Sidebar>{children}</Sidebar>
}

PrivatePages.propTypes = {
  children: PropTypes.node.isRequired,
}

const AppRoutes = ({ children }) =>
  createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path={publicPaths.signup} element={<Signup />} />
        <Route path={publicPaths.signupConfirm} element={<SignupConfirm />} />
        <Route path={publicPaths.auth} element={<Auth />} />
        <Route path={publicPaths.logout} element={<Logout />} />
        <Route path={publicPaths.ppd} element={<LegalContainer type={Ppd} />} />
        <Route path={publicPaths.cguWeb} element={<LegalContainer type={CGUWeb} />} />
        <Route path={publicPaths.cguMobile} element={<LegalContainer type={CGUMobile} />} />
        <Route path={publicPaths.cookiesWeb} element={<LegalContainer type={CookiesWeb} />} />
        <Route path={publicPaths.cookiesMobile} element={<LegalContainer type={CookiesMobile} />} />
        <Route path="*" element={<PrivatePages>{children}</PrivatePages>} />
      </Route>
    )
  )
AppRoutes.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AppRoutes
