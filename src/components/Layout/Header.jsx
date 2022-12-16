import PropTypes from 'prop-types'
import { Bars3BottomLeftIcon, BellIcon } from '@heroicons/react/24/outline'
import { useUserScope } from '../../redux/user/hooks'
import { LogoLarge } from './shared/Logo'

const Header = ({ handleDrawerToggle }) => {
  const [currentScope, updateCurrentScope] = useUserScope()

  return (
    <div className="sticky top-0 z-10 flex items-center py-3 bg-white shadow shrink-0 lg:bg-transparent lg:backdrop-blur-md lg:shadow-none lg:border-b lg:border-gray-200 lg:relative">
      <button
        type="button"
        className="inline-flex items-center h-full px-4 py-2 text-gray-500 border-r border-gray-200 focus:outline-none lg:hidden"
        onClick={handleDrawerToggle}
      >
        <span className="sr-only">Ouvrir la sidebar</span>
        <Bars3BottomLeftIcon className="w-6 h-6" aria-hidden="true" />
      </button>
      <div className="flex justify-between flex-1 px-4">
        <div className="flex flex-1">
          <div className="flex items-center w-full md:ml-0 lg:max-w-sm lg:hidden">
            <LogoLarge classes="h-6 w-auto text-re-blue-600" />
          </div>
        </div>
        <div className="flex items-center ml-4 sm:divide-x sm:divide-gray-200 lg:ml-6">
          <div className="pr-4">
            <span className="hidden sm:inline-flex items-center rounded-md bg-re-blue-50 px-3 py-1.5 text-sm font-medium text-re-blue-500">
              {currentScope?.name} ({currentScope?.zones[0]?.code})
            </span>
          </div>
          <div className="sm:pl-4">
            <button
              type="button"
              className="p-1 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-re-blue-500 focus:ring-offset-2"
            >
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
