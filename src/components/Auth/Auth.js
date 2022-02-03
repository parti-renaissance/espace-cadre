import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useInitializeAuth, useRequestAccessToken } from '../../redux/auth/hooks'
import BootPage from '../BootPage'

const Auth = () => {
  const { search } = useLocation()
  const initializeAuth = useInitializeAuth()
  const [, requestAccessToken] = useRequestAccessToken()

  useEffect(() => {
    const code = new URLSearchParams(search).get('code')

    if (typeof code === 'string' && code.length > 0) {
      requestAccessToken(code)
    }
    // } else {
    //   initializeAuth()
    // }
  }, [initializeAuth, requestAccessToken, search])

  return <BootPage />
}

export default Auth
