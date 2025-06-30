import React, { useState } from 'react';
import { useDarkMode } from '../context/Darkmode';
import { useAuth } from '../context/AuthContext';
import { ref, push, set } from 'firebase/database';
import { db } from '../firebase/config';

export const AddTaskButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskText, setTaskText] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const { isDarkMode } = useDarkMode();
  const { user } = useAuth();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setTaskText('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (taskText.trim() && user) {
      setIsAdding(true);
      try {
        const newTaskRef = push(ref(db, `users/${user.uid}/tasks`)); 
        
        await set(newTaskRef, {
          text: taskText,
          completed: false,
          createdAt: Date.now(),
        });

        console.log('New task added to Firebase:', taskText);
        closeModal();
      } catch (error) {
        console.error('Error adding task:', error);
        // Show user-friendly error message
        alert('Failed to add task. Please try again.');
      } finally {
        setIsAdding(false);
      }
    } else if (!user) {
      alert("You must be logged in to add tasks.");
    }
  };

  return (
    <>
      {/* Floating Add Button */}
      <button
        onClick={openModal}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:h-16 sm:w-16"
      >
        <svg
          className="h-6 w-6 sm:h-7 sm:w-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Modal Overlay and Content */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 backdrop-blur-sm sm:items-center sm:justify-center">
          {/* Transparent Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300"
            onClick={closeModal}
          ></div>

          {/* Modal Content */}
          <div
            className={`relative w-full max-w-sm rounded-t-3xl border p-6 shadow-2xl transition-all duration-300 sm:max-w-md sm:rounded-3xl md:max-w-lg lg:max-w-xl ${
              isDarkMode
                ? 'border-gray-700 bg-gray-800 text-white'
                : 'border-gray-100 bg-white text-gray-900'
            }`}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className={`absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 ${
                isDarkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal Header */}
            <div className="mb-8 flex items-center">
              <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 shadow-md">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-2xl font-extrabold sm:text-3xl">Add New Task</h2>
            </div>

            {/* Task Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="taskInput" className={`mb-3 flex items-center text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <svg
                    className="mr-2 h-4 w-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  What needs to be done?
                </label>
                <textarea
                  id="taskInput"
                  value={taskText}
                  onChange={(e) => setTaskText(e.target.value)}
                  placeholder="E.g., Finish the quarterly report by Friday..."
                  className={`min-h-[120px] w-full resize-y rounded-xl border-2 px-4 py-3 text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-lg ${
                    isDarkMode
                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500'
                      : 'border-gray-200 bg-white text-gray-800 placeholder-gray-500 focus:border-blue-500'
                  }`}
                  autoFocus
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse justify-end space-y-3 space-y-reverse pt-4 sm:flex-row sm:space-x-3 sm:space-y-0">
                <button
                  type="button"
                  onClick={closeModal}
                  className={`flex w-full items-center justify-center rounded-xl px-6 py-3 text-base font-semibold shadow-sm transition-all duration-200 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 sm:w-auto ${
                    isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:text-gray-700'
                  }`}
                >
                  <svg
                    className="mr-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!taskText.trim() || isAdding}
                  className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:shadow-none focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto"
                >
                  <svg
                    className="mr-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  {isAdding ? 'Adding...' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};