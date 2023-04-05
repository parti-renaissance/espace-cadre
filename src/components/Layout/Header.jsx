import { useUserScope } from '../../redux/user/hooks'
import { LogoLarge } from 'ui/Logo/Logo'

const Header = () => {
  const [currentScope] = useUserScope()

  return (
    <div className="header">
      <div className="flex justify-between flex-1 px-4">
        <div className="flex flex-1">
          <div className="logo-large">
            <LogoLarge classes="h-6 w-auto" fillColor="#0f172a" strokeColor="#0f172a" />
          </div>
        </div>
        <div className="header-scope">
          <div className="pr-4">
            <span className="badge badge-primary">{currentScope.getName()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
