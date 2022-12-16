import PropTypes from 'prop-types'
import { Bars3BottomLeftIcon, BellIcon } from '@heroicons/react/24/outline'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { useUserScope } from '../../redux/user/hooks'

const Header = ({ handleDrawerToggle }) => {
  const [currentScope, updateCurrentScope] = useUserScope()

  return (
    <div className="sticky top-0 z-10 flex items-center py-3 bg-white shadow shrink-0 lg:bg-transparent lg:backdrop-blur-md lg:shadow-none lg:border-b lg:border-gray-200 lg:relative">
      <button
        type="button"
        className="px-4 text-gray-500 border-r border-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-re-blue-500 md:hidden"
        onClick={handleDrawerToggle}
      >
        <span className="sr-only">Ouvrir la sidebar</span>
        <Bars3BottomLeftIcon className="w-6 h-6" aria-hidden="true" />
      </button>
      <div className="flex justify-between flex-1 px-4">
        <div className="flex flex-1">
          <div className="flex w-full md:ml-0 md:max-w-sm lg:hidden">
            <label htmlFor="search-field" className="sr-only">
              Recherche
            </label>
            <div className="relative w-full text-gray-400 focus-within:text-gray-600">
              <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="w-5 h-5" aria-hidden="true" />
              </div>
              <input
                id="search-field"
                className="block w-full h-full py-2 pl-8 pr-3 text-gray-900 placeholder-gray-500 border-transparent focus:border-transparent focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm"
                placeholder="Search"
                type="search"
                name="search"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center ml-4 divide-x divide-gray-200 md:ml-6">
          <div className="pr-4">
            <span className="inline-flex items-center rounded-md bg-re-blue-50 px-3 py-1.5 text-sm font-medium text-re-blue-500">
              {currentScope?.name} ({currentScope?.zones[0]?.code})
            </span>
          </div>
          <div className="pl-4">
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
