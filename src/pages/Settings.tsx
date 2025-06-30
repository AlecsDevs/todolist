import React, { useState } from 'react';
import { useDarkMode } from '../context/Darkmode'; // Adjust path if needed
import { FiSun, FiMoon, FiGlobe, FiBell, FiChevronRight } from 'react-icons/fi'; // Icons

export const Settings = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // State for notification toggle (example setting)
  const [enableNotifications, setEnableNotifications] = useState(true);
  // State for selected language (example setting)
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const handleNotificationsToggle = () => {
    setEnableNotifications(prev => !prev);
    // In a real app, you'd save this preference to a backend or localStorage
    console.log(`Notifications toggled to: ${!enableNotifications}`);
  };

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
    // In a real app, you'd update the app's language context/state
    console.log(`Language changed to: ${e.target.value}`);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 lg:p-10 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">Settings</h1>

      <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10">

        {/* General Settings Section */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-3">General</h2>
          <div className="space-y-4">

            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                {isDarkMode ? <FiSun className="w-6 h-6 mr-3 text-yellow-500" /> : <FiMoon className="w-6 h-6 mr-3 text-indigo-500" />}
                <span className="text-lg text-gray-700 dark:text-gray-200">Dark Mode</span>
              </div>
              {/* Tailwind CSS Toggle Switch */}
              <label htmlFor="darkModeToggle" className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="darkModeToggle"
                    className="sr-only"
                    checked={isDarkMode}
                    onChange={toggleDarkMode}
                  />
                  <div className="block bg-gray-300 dark:bg-gray-600 w-14 h-8 rounded-full transition-colors duration-300"></div>
                  <div className="dot absolute left-1 top-1 bg-white dark:bg-gray-200 w-6 h-6 rounded-full transition-transform duration-300 transform"
                       style={{ transform: isDarkMode ? 'translateX(24px)' : 'translateX(0)' }}></div>
                </div>
              </label>
            </div>

            {/* Notifications Toggle */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <FiBell className="w-6 h-6 mr-3 text-blue-500" />
                <span className="text-lg text-gray-700 dark:text-gray-200">Enable Notifications</span>
              </div>
              <label htmlFor="notificationsToggle" className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="notificationsToggle"
                    className="sr-only"
                    checked={enableNotifications}
                    onChange={handleNotificationsToggle}
                  />
                  <div className="block bg-gray-300 dark:bg-gray-600 w-14 h-8 rounded-full transition-colors duration-300"></div>
                  <div className="dot absolute left-1 top-1 bg-white dark:bg-gray-200 w-6 h-6 rounded-full transition-transform duration-300 transform"
                       style={{ transform: enableNotifications ? 'translateX(24px)' : 'translateX(0)' }}></div>
                </div>
              </label>
            </div>

            {/* Language Selection */}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <FiGlobe className="w-6 h-6 mr-3 text-green-500" />
                <span className="text-lg text-gray-700 dark:text-gray-200">Language</span>
              </div>
              <div className="relative">
                <select
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                  className="block appearance-none w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-200">
                  <FiChevronRight className="transform rotate-90 w-4 h-4" />
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Account Settings Section (Placeholder) */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-3">Account</h2>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between py-2 px-3 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <span className="text-lg">Change Password</span>
              <FiChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between py-2 px-3 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <span className="text-lg">Update Profile Info</span>
              <FiChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </section>

        {/* About & Support Section */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-3">About & Support</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <span className="text-lg text-gray-700 dark:text-gray-200">Version</span>
              <span className="text-gray-600 dark:text-gray-400">1.0.0</span>
            </div>
            <a href="#" className="w-full flex items-center justify-between py-2 px-3 rounded-md text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
              <span className="text-lg">Privacy Policy</span>
              <FiChevronRight className="w-5 h-5" />
            </a>
            <a href="#" className="w-full flex items-center justify-between py-2 px-3 rounded-md text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
              <span className="text-lg">Terms of Service</span>
              <FiChevronRight className="w-5 h-5" />
            </a>
          </div>
        </section>

      </div>
    </div>
  );
};