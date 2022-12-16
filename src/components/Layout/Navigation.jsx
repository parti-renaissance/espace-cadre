import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { HomeIcon, Cog6ToothIcon, LifebuoyIcon } from '@heroicons/react/24/outline'

import Logo from './shared/Logo'
import { classNames } from 'shared/helpers'
import NavMenu from './NavMenu'
import Scopes from 'components/Scopes'

const Navigation = () => {
  return (
    <div className="flex h-full">
      <div className="flex flex-col px-2 py-5 space-y-8 w-14 bg-re-blue-500">
        <Logo classes="h-3 w-auto text-white" />
        <div className="flex-1">
          <Scopes />
          <div className="h-full mt-5 overflow-y-auto">
            <ul className="flex flex-col items-center space-y-2" role="menuitem">
              <li className="flex items-center justify-center">
                <a href="#" className="text-sm text-re-blue-200 hover:text-white">
                  <HomeIcon className="h-7 w-7" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center pb-4 space-y-3 shrink-0">
          <a
            href="#"
            className="inline-flex items-center justify-center p-1 text-sm rounded-md text-re-blue-100 hover:text-white hover:bg-re-blue-400"
          >
            <Cog6ToothIcon className="w-6 h-6" />
          </a>
          <a
            href="#"
            className="inline-flex items-center justify-center p-1 text-sm rounded-md text-re-blue-100 hover:text-white hover:bg-re-blue-400"
          >
            <LifebuoyIcon className="w-6 h-6" />
          </a>
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="flex items-center text-gray-400 bg-gray-100 rounded-full hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-100">
                <span className="sr-only">Profile utilisateur</span>
                <img
                  className="inline-block w-8 h-8 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="User profile"
                />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute w-48 mt-2 origin-bottom-left bg-white rounded-md shadow-lg left-8 bottom-4 z-8 ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'flex items-center px-4 py-2 text-sm'
                        )}
                      >
                        <svg
                          className="h-5 w-5 mr-2.5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="1.5"
                          viewBox="0 0 20 20"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M13.333 14.167 17.5 10m0 0-4.167-4.167M17.5 10h-10m2.5 4.167c0 .246 0 .37-.01.476a2.5 2.5 0 0 1-2.002 2.238c-.105.02-.228.035-.473.062l-.85.094c-1.28.142-1.919.213-2.427.05a2.5 2.5 0 0 1-1.52-1.36C2.5 15.24 2.5 14.597 2.5 13.31V6.69c0-1.287 0-1.93.218-2.417a2.5 2.5 0 0 1 1.52-1.36c.508-.163 1.147-.092 2.426.05l.851.094c.245.027.368.041.473.062A2.5 2.5 0 0 1 9.99 5.357c.009.107.009.23.009.476"
                          />
                        </svg>
                        Me déconnecter
                      </a>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
      <div className="flex-1">
        <NavMenu />
      </div>
    </div>
  )
}

export default Navigation
