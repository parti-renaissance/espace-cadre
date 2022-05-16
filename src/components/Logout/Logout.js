import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { userLogout } from '../../redux/auth'
import { OAUTH_HOST } from 'shared/environments'

const Logout = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(userLogout())
    window.location.href = `${OAUTH_HOST}/deconnexion`
  }, [dispatch])

  return <div />
}

export default Logout
