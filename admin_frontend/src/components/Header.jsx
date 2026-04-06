import React from 'react';
import { Bell, User } from 'lucide-react';

const Header = ({ title }) => {
  return (
    <header className="bg-white dark:bg-dark-card border-b border-gray-100 dark:border-dark-border px-8 py-4 sticky top-0 z-40 transition-colors duration-300">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-secondary dark:text-white font-spartan">
          {title}
        </h1>
        
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <button className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-secondary dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-border rounded-xl transition-all duration-300">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          
          {/* User Profile */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-dark-border">
            <div className="w-9 h-9 bg-gray-100 dark:bg-dark-border rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
            <span className="text-sm font-medium text-secondary dark:text-white">Users</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
