import PropTypes from 'prop-types'
import { Bars3BottomLeftIcon, BellIcon } from '@heroicons/react/24/outline'

import { useUserScope } from '../../redux/user/hooks'
import { LogoLarge } from 'ui/Logo/Logo'

const Header = ({ handleDrawerToggle }) => {
  const [currentScope, updateCurrentScope] = useUserScope()

  return (
    <div className="header">
      <button type="button" className="button-drawer" onClick={handleDrawerToggle}>
        <span className="sr-only">Ouvrir la sidebar</span>
        <Bars3BottomLeftIcon className="w-6 h-6" aria-hidden="true" />
      </button>
      <div className="flex justify-between flex-1 px-4">
        <div className="flex flex-1">
          <div className="logo-large">
            <LogoLarge classes="h-6 w-auto" fillColor="#0f172a" strokeColor="#0f172a" />
          </div>
        </div>
        <div className="header-scope">
          <div className="pr-4">
            <span className="scope-badge">
              {currentScope?.name} ({currentScope?.zones[0]?.code})
            </span>
          </div>
          <div>
            <button type="button" className="button-notification">
              <span className="sr-only">Voir les notifications</span>
              <BellIcon className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header

Header.propTypes = {
  handleDrawerToggle: PropTypes.func.isRequired,
}
