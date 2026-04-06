import React from 'react';
import { Bell, User, Menu } from 'lucide-react';

const Header = ({ title, onMobileMenuToggle }) => {
  return (
    <header className="bg-white dark:bg-dark-card border-b border-gray-100 dark:border-dark-border px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-30 transition-colors duration-300">
      <div className="flex items-center justify-between gap-4">
        {/* Left side - Menu button (mobile) + Title */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile Menu Button */}
          <button
            onClick={onMobileMenuToggle}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-secondary dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-border rounded-xl transition-all lg:hidden flex-shrink-0"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <h1 className="text-xl sm:text-2xl font-bold text-secondary dark:text-white font-spartan truncate">
            {title}
          </h1>
        </div>
        
        {/* Right side - Notifications + User */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          {/* Notification Bell */}
          <button className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-secondary dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-border rounded-xl transition-all duration-300">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </button>
          
          {/* User Profile */}
          <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-gray-200 dark:border-dark-border">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-primary/10 dark:bg-dark-border rounded-full flex items-center justify-center ring-2 ring-primary/20 transition-all hover:ring-primary/40">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-secondary dark:text-white hidden sm:block">Users</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
