import { useEffect } from 'react'
import Loader from '~/ui/Loader'
import { OAUTH_HOST } from '~/shared/environments'
import { useUserScope } from '~/redux/user/hooks'

const RedirectToEaggle = () => {
  const [currentScope] = useUserScope()

  useEffect(() => (window.location.href = `${OAUTH_HOST}/eaggle?scope=${currentScope.getMainCode()}`), [currentScope])

  return <Loader isCenter size={40} />
}

export default RedirectToEaggle
