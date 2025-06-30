// src/Project.jsx (or wherever your Project component is)
import React from 'react';
import { useDarkMode } from '../context/Darkmode'; // Adjust the path as needed

export const Project = () => {
  const { isDarkMode } = useDarkMode();

  // Define classes that change based on dark mode
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-gray-100';
  const textColor = isDarkMode ? 'text-gray-100' : 'text-gray-800';

  return (
     <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <p className={`text-2xl sm:text-4xl md:text-5xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} animate-pulse text-center p-4`}>
        Coming Soon! hehe
      </p>
    </div>
  );
};