import React, { useState } from 'react'; // Import useState
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/Darkmode';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiCheckSquare,
  FiFolder,
  FiCalendar,
  FiSettings,
  FiLogOut,
  FiX,
  FiMoon,
  FiSun,
  FiLoader // Import FiLoader for loading spinner
} from 'react-icons/fi';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const location = useLocation();

  // State for logout confirmation modal
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  // State for loading indicator during logout
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    // Show the confirmation modal instead of logging out directly
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setIsLoggingOut(true); // Start loading
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
      // Optionally show an error message to the user
    } finally {
      setIsLoggingOut(false); // End loading
      setShowLogoutModal(false); // Close modal
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const getUserDisplayName = () => {
    if (user?.displayName) {
      return user.displayName.split(' ')[0];
    }
    return user?.email?.split('@')[0] || 'User';
  };

  const getUserInitials = () => {
    if (user?.displayName) {
      const names = user.displayName.split(' ');
      return names.length > 1
        ? `${names[0][0]}${names[1][0]}`.toUpperCase()
        : names[0][0].toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  const sidebarItems = [
    { icon: FiCheckSquare, label: 'My Tasks', path: '/' },
    { icon: FiFolder, label: 'Project', path: '/project' },
    { icon: FiCalendar, label: 'Calendar', path: '/calendar' },
    { icon: FiSettings, label: 'Settings', path: '/settings' },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>

        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Todo-List</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* User Profile Section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="relative">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-200 dark:border-blue-400"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-500 dark:bg-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                  {getUserInitials()}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-gray-800"></div>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {getUserDisplayName()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Dark Mode Toggle - Now using context */}
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-center px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            {isDarkMode ? (
              <>
                <FiSun className="w-4 h-4 mr-2" />
                Switch to Light Mode
              </>
            ) : (
              <>
                <FiMoon className="w-4 h-4 mr-2" />
                Switch to Dark Mode
              </>
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {sidebarItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-l-4 border-blue-700 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4">
          <button
            onClick={handleLogout} // This now triggers the modal
            className="w-full flex items-center px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <FiLogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-60">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm transform transition-all scale-100 opacity-100">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Confirm Logout</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                disabled={isLoggingOut} // Disable while logging out
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center justify-center"
                disabled={isLoggingOut} // Disable while logging out
              >
                {isLoggingOut ? (
                  <>
                    <FiLoader className="animate-spin mr-2" /> Logging out...
                  </>
                ) : (
                  'Logout'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;