import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { userLogout } from '../../redux/auth'
import { RENAISSANCE_HOST, OAUTH_HOST } from '~/shared/environments'
import { isSwitchUser } from '../../redux/user/selectors'

const Logout = () => {
  const dispatch = useDispatch()
  const isSwitchedUser = useSelector(isSwitchUser)

  useEffect(() => {
    const logOutUrl = isSwitchedUser
      ? `${RENAISSANCE_HOST}/admin/app/adherent/list?_switch_user=_exit`
      : `${OAUTH_HOST}/deconnexion`
    dispatch(userLogout(isSwitchedUser))
    window.location.href = logOutUrl
  })

  return <div />
}

export default Logout
