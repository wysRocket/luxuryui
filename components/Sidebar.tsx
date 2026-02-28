import React from 'react';
import { NAV_ITEMS } from '../constants';
import { NavItem } from '../types';

const Sidebar: React.FC = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hidden lg:flex flex-col z-40 transition-colors duration-300">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-gray-900">
        <div className="font-bold text-xl tracking-tight flex items-center gap-2 dark:text-white">
            <div className="w-6 h-6 bg-black dark:bg-white rounded-md"></div>
            LuxuryUI
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-4 px-2">Menu</div>
        {NAV_ITEMS.map((item: NavItem) => (
          <a
            key={item.label}
            href="#"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              item.active 
                ? 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            {item.icon}
            {item.label}
          </a>
        ))}

        <div className="mt-8 text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-4 px-2">Library</div>
        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white">
           <span className="w-5 h-5 rounded border border-gray-300 dark:border-gray-700 flex items-center justify-center text-[10px] text-gray-400 dark:text-gray-500">iOS</span>
           iOS Apps
        </a>
        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white">
           <span className="w-5 h-5 rounded border border-gray-300 dark:border-gray-700 flex items-center justify-center text-[10px] text-gray-400 dark:text-gray-500">An</span>
           Android Apps
        </a>
        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white">
           <span className="w-5 h-5 rounded border border-gray-300 dark:border-gray-700 flex items-center justify-center text-[10px] text-gray-400 dark:text-gray-500">Web</span>
           Web Apps
        </a>
      </nav>

      {/* Footer / CTA */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-900">
        <div className="bg-gray-900 dark:bg-gray-800 rounded-xl p-4 text-white">
          <p className="text-sm font-semibold mb-1">Get full access</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">Unlock all features and patterns.</p>
          <button className="w-full py-2 bg-white dark:bg-white text-black text-xs font-bold rounded-lg hover:bg-gray-100 transition-colors">
            Upgrade to Pro
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;