import { authClient } from 'services/networking/client'
import { store } from '../redux/store'
import { userLogout } from '../redux/auth'

export const logout = async () => {
  window.location.href = `${process.env.REACT_APP_OAUTH_HOST}/deconnexion`
  store.dispatch(userLogout())
}
