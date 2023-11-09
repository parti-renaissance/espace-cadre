import { useUserScope } from '../../redux/user/hooks'

const Header = () => {
  const [currentScope] = useUserScope()

  return (
    <div className="header">
      <div className="flex justify-between flex-1 px-4">
        <div className="flex flex-1">
          <div className="logo-large">
            <div className="app-name">Espace cadre</div>
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
