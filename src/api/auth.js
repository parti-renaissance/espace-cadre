import { authClient } from 'services/networking/client'
import { store } from '../redux/store'
import { userLogout } from '../redux/auth'

export const logout = async () => {
  await authClient.get('/deconnexion')
  store.dispatch(userLogout())
}
