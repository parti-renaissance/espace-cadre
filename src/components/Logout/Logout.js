import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { userLogout } from '../../redux/auth'

const Logout = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(userLogout())
    window.location.href = `${process.env.REACT_APP_OAUTH_HOST}/deconnexion`
  }, [dispatch])

  return <div />
}

export default Logout
