import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Search, LogOut } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 z-10 sticky top-0 shadow-sm backdrop-blur-md bg-white/80">
      <div className="flex-1 flex items-center">
        <div className="relative w-72 group">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400 group-focus-within:text-primary-500 transition-colors" />
          </span>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl text-sm placeholder-gray-400 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all-smooth"
            placeholder="Search across workspace..."
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all-smooth">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse"></span>
        </button>
        
        <div className="h-8 w-px bg-gray-200 mx-2"></div>
        
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="flex items-center gap-3 p-1 rounded-full hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/20">
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-900 leading-tight">{user?.name}</span>
              <span className="text-xs text-gray-500">{user?.role}</span>
            </div>
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-primary-500/20">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </Menu.Button>
          
          <Transition
            as={React.Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-rose-50 text-rose-600' : 'text-gray-700'
                      } group flex w-full items-center rounded-lg px-2 py-2 text-sm font-medium transition-colors`}
                      onClick={logout}
                    >
                      <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  );
};

export default Navbar;
