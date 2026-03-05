import React from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../constants';
import { NavItem } from '../types';

const Sidebar: React.FC = () => {
  const libraryLinkClassName = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white'
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white'
    }`;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hidden lg:flex flex-col z-40 transition-colors duration-300">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-gray-900">
        <Link to="/" className="font-bold text-xl tracking-tight flex items-center gap-2 dark:text-white">
            <div className="w-6 h-6 bg-black dark:bg-white rounded-md"></div>
            LuxuryUI
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-4 px-2">Menu</div>
        {NAV_ITEMS.map((item: NavItem) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}

        <div className="mt-8 text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-4 px-2">Library</div>
        <NavLink to="/ios-apps" className={libraryLinkClassName}>
           <span className="w-6 h-6 rounded-md border border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-950">
             <Smartphone size={14} />
           </span>
           <span>iOS Apps</span>
        </NavLink>
        <NavLink to="/android-apps" className={libraryLinkClassName}>
           <span className="w-6 h-6 rounded-md border border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-950">
             <Smartphone size={14} />
           </span>
           <span>Android Apps</span>
        </NavLink>
        <NavLink to="/web-apps" className={libraryLinkClassName}>
           <span className="w-6 h-6 rounded-md border border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-950">
             <Monitor size={14} />
           </span>
           <span>Web Apps</span>
        </NavLink>
      </nav>

      {/* Footer / CTA */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-900">
        <div className="bg-gray-900 dark:bg-gray-800 rounded-xl p-4 text-white">
          <p className="text-sm font-semibold mb-1">Get full access</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">Unlock all features and patterns.</p>
          <Link to="/pricing" className="block w-full py-2 text-center bg-white dark:bg-white text-black text-xs font-bold rounded-lg hover:bg-gray-100 transition-colors">
            Upgrade to Pro
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
