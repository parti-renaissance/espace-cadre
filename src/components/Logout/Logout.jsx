import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { userLogout } from '~/redux/auth'
import { ADMIN_HOST, OAUTH_HOST } from '~/shared/environments'
import { isSwitchUser } from '~/redux/user/selectors'

const Logout = () => {
  const dispatch = useDispatch()
  const isSwitchedUser = useSelector(isSwitchUser)

  useEffect(() => {
    const logOutUrl = isSwitchedUser
      ? `${ADMIN_HOST}/app/adherent/list?_switch_user=_exit`
      : `${OAUTH_HOST}/deconnexion`
    dispatch(userLogout(isSwitchedUser))
    window.location.href = logOutUrl
  })

  return <div />
}

export default Logout
