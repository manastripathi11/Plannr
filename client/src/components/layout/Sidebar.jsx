import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, Settings } from 'lucide-react';
import { cn } from '../../utils/cn';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Projects', icon: FolderKanban, path: '/projects' },
    { name: 'Tasks', icon: CheckSquare, path: '/tasks' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-full shadow-[var(--shadow-subtle)] z-20">
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <div className="flex items-center gap-3 text-primary-600 font-extrabold text-2xl tracking-tight">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md shadow-primary-500/20">
            <span className="text-white text-lg leading-none">P</span>
          </div>
          Plannr
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">Menu</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all-smooth group',
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={20} className={cn('transition-colors', isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600')} />
                  {item.name}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
      <div className="p-4 border-t border-gray-100">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full transition-all-smooth group">
          <Settings size={20} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
          Settings
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
