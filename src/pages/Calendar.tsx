import { db } from '../firebase/config';
import { ref, onValue, update } from "firebase/database";
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/Darkmode';
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Check, Circle, X, CheckCircle2 } from 'lucide-react';

export const Calendar = () => {
  const { user } = useAuth();
  const { isDarkMode } = useDarkMode();
  const [tasks, setTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    const tasksRef = ref(db, `users/${user.uid}/tasks`);
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      
      if (data) {
        const tasksArray = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
        }));
        setTasks(tasksArray);
      } else {
        setTasks([]);
      }
    });
    
    return () => unsubscribe();
  }, [user]);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      if (!task.createdAt) return false;
      const taskDate = new Date(task.createdAt);
      return (
        taskDate.getDate() === date &&
        taskDate.getMonth() === currentDate.getMonth() &&
        taskDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const toggleTaskCompletion = async (taskId, currentStatus) => {
    if (!user) return;
    
    try {
      const taskRef = ref(db, `users/${user.uid}/tasks/${taskId}`);
      await update(taskRef, {
        completed: !currentStatus
      });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const handleDateClick = (day) => {
    const dayTasks = getTasksForDate(day);
    if (dayTasks.length > 0) {
      setSelectedDate({
        day,
        tasks: dayTasks,
        month: currentDate.getMonth(),
        year: currentDate.getFullYear()
      });
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  const formatDate = (day, month, year) => {
    const date = new Date(year, month, day);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Create array of days for the calendar grid
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <>
      <div className="p-2 sm:p-4 lg:p-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">Calendar</h1>

        <div className={`max-w-6xl mx-auto rounded-xl shadow-lg transition-all duration-300 ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
        }`}>
          {/* Calendar Header */}
          
          <div className={`flex items-center justify-between p-4 sm:p-6 border-b ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <button
              onClick={() => navigateMonth(-1)}
              className={`p-2 sm:p-3 rounded-lg hover:scale-110 transition-all duration-200 ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft size={20} />
            </button>
            
            <h2 className={`text-lg sm:text-xl lg:text-2xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            
            <button
              onClick={() => navigateMonth(1)}
              className={`p-2 sm:p-3 rounded-lg hover:scale-110 transition-all duration-200 ${
                isDarkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="p-2 sm:p-4 lg:p-6">
            {/* Day Names Header */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-4">
              {dayNames.map(day => (
                <div
                  key={day}
                  className={`text-center font-semibold py-2 text-xs sm:text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  <span className="hidden sm:inline">{day}</span>
                  <span className="sm:hidden">{day.slice(0, 1)}</span>
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {calendarDays.map((day, index) => {
                if (!day) {
                  return <div key={index} className="h-16 sm:h-20 lg:h-24"></div>;
                }

                const dayTasks = getTasksForDate(day);
                const completedTasks = dayTasks.filter(task => task.completed);
                const isToday = 
                  day === new Date().getDate() &&
                  currentDate.getMonth() === new Date().getMonth() &&
                  currentDate.getFullYear() === new Date().getFullYear();

                return (
                  <div
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`h-16 sm:h-20 lg:h-24 border rounded-lg p-1 sm:p-2 transition-all duration-200 ${
                      dayTasks.length > 0 ? 'cursor-pointer hover:scale-105' : ''
                    } ${
                      isDarkMode 
                        ? 'border-gray-700 hover:border-gray-600' 
                        : 'border-gray-300 hover:border-gray-400'
                    } ${
                      isToday 
                        ? isDarkMode 
                          ? 'bg-blue-900 border-blue-600 shadow-lg' 
                          : 'bg-blue-50 border-blue-400 shadow-md'
                        : isDarkMode 
                          ? 'bg-gray-800 hover:bg-gray-750' 
                          : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start h-full">
                      <span className={`text-xs sm:text-sm font-medium ${
                        isToday 
                          ? isDarkMode ? 'text-blue-200' : 'text-blue-700'
                          : isDarkMode ? 'text-gray-300' : 'text-gray-800'
                      }`}>
                        {day}
                      </span>
                      
                      {dayTasks.length > 0 && (
                        <div className="text-right">
                          <div className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                            completedTasks.length === dayTasks.length
                              ? 'bg-green-500 text-white'
                              : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                          }`}>
                            {completedTasks.length}/{dayTasks.length}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {dayTasks.length > 0 && (
                      <div className="mt-1">
                        <div className="flex gap-1 flex-wrap justify-start">
                          {dayTasks.slice(0, 3).map(task => (
                            <div
                              key={task.id}
                              className={`w-2 h-2 rounded-full ${
                                task.completed 
                                  ? 'bg-green-500' 
                                  : isDarkMode ? 'bg-gray-500' : 'bg-gray-400'
                              }`}
                              title={task.text}
                            ></div>
                          ))}
                          {dayTasks.length > 3 && (
                            <span className={`text-xs font-medium ${
                              isDarkMode ? 'text-gray-500' : 'text-gray-400'
                            }`}>
                              +{dayTasks.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Enhanced Legend */}
          <div className={`px-4 sm:px-6 pb-4 sm:pb-6 border-t pt-4 ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-center gap-6 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Completed
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  isDarkMode ? 'bg-gray-500' : 'bg-gray-400'
                }`}></div>
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Pending
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  isDarkMode ? 'bg-blue-600' : 'bg-blue-400'
                }`}></div>
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Today
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Modal */}
      {isModalOpen && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-md max-h-[80vh] rounded-xl shadow-2xl ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            {/* Modal Header */}
            <div className={`flex items-center justify-between p-4 sm:p-6 border-b ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div>
                <h3 className={`text-lg sm:text-xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  Tasks for {formatDate(selectedDate.day, selectedDate.month, selectedDate.year).split(',')[0]}
                </h3>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {selectedDate.tasks.length} task{selectedDate.tasks.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={closeModal}
                className={`p-2 rounded-lg hover:scale-110 transition-all duration-200 ${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 max-h-96 overflow-y-auto">
              <div className="space-y-3">
                {selectedDate.tasks.map(task => (
                  <div
                    key={task.id}
                    className={`flex items-start gap-3 p-3 rounded-lg transition-all duration-200 ${
                      isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-650' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <button
                      onClick={() => toggleTaskCompletion(task.id, task.completed)}
                      className={`flex-shrink-0 mt-0.5 p-1 rounded-full transition-all duration-200 ${
                        task.completed
                          ? 'text-green-500 hover:text-green-400'
                          : isDarkMode 
                            ? 'text-gray-500 hover:text-gray-400' 
                            : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {task.completed ? (
                        <CheckCircle2 size={20} />
                      ) : (
                        <Circle size={20} />
                      )}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm sm:text-base ${
                        task.completed
                          ? isDarkMode 
                            ? 'text-gray-400 line-through' 
                            : 'text-gray-500 line-through'
                          : isDarkMode ? 'text-gray-200' : 'text-gray-800'
                      }`}>
                        {task.text}
                      </p>
                      {task.priority && (
                        <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                          task.priority === 'high' 
                            ? 'bg-red-500 text-white'
                            : task.priority === 'medium'
                            ? 'bg-yellow-500 text-white'
                            : 'bg-green-500 text-white'
                        }`}>
                          {task.priority}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`px-4 sm:px-6 py-3 border-t ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center justify-between text-sm">
                <span className={`${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {selectedDate.tasks.filter(t => t.completed).length} of {selectedDate.tasks.length} completed
                </span>
                <button
                  onClick={closeModal}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};