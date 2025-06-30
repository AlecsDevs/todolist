import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { FiMenu } from 'react-icons/fi';

export const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Menu Button */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 hover:text-gray-700 dark:text-white dark:hover:text-gray-200"
          >
            <FiMenu size={24} />
          </button>
        </header>
        
        <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
          {children}
        </main>
      </div>
    </div>
  );
};