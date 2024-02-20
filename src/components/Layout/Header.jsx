import { useUserScope } from '../../redux/user/hooks'

const Header = () => {
  const [currentScope] = useUserScope()

  return <div className="header"></div>
}

export default Header
