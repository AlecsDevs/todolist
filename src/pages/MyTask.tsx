import { db } from '../firebase/config';
import { ref, onValue, update, remove } from "firebase/database";
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/Darkmode';
import { useState, useEffect } from "react";
import { AddTaskButton } from '../components/AddTaskButton';
import { Edit2, Trash2, Check, X, Plus, AlertTriangle } from 'lucide-react';

export const MyTask = () => {
  const { user } = useAuth();
  const { isDarkMode } = useDarkMode();
  const [tasks, setTask] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    const newTaskRef = ref(db, `users/${user.uid}/tasks`);
    const unsubscribe = onValue(newTaskRef, (snapshot) => {
      const data = snapshot.val();
      
      if (data) {
        const TaskArray = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
        }));
        setTask(TaskArray);
      } else {
        setTask([])
      }
    });
    
    return () => unsubscribe();
  }, [user]);

  const handleComplete = async (taskId, currentStatus) => {
    try {
      const taskRef = ref(db, `users/${user.uid}/tasks/${taskId}`);
      await update(taskRef, {
        completed: !currentStatus
      });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDelete = async (taskId) => {
    setTaskToDelete(taskId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;
    
    try {
      const taskRef = ref(db, `users/${user.uid}/tasks/${taskToDelete}`);
      await remove(taskRef);
      setShowDeleteModal(false);
      setTaskToDelete(null);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  const handleEdit = (task) => {
    setEditingTask(task.id);
    setEditText(task.text);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (editText.trim() === '') return;
    
    try {
      const taskRef = ref(db, `users/${user.uid}/tasks/${editingTask}`);
      await update(taskRef, {
        text: editText.trim()
      });
      setEditingTask(null);
      setEditText('');
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setEditText('');
    setShowEditModal(false);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
      <div className=" sm:p-9 ">
      <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">My Task</h1>

        
        <div className="space-y-3 sm:space-y-1">
          {tasks.map((task) => (
            <div 
              key={task.id} 
              className={`border rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => handleComplete(task.id, task.completed)}
                    className={`mt-1 sm:mt-0 w-5 h-5 rounded-full border-2 flex items-center justify-center hover:border-blue-500 transition-colors flex-shrink-0 hover:scale-110 ${
                      isDarkMode ? 'border-gray-600' : 'border-gray-300'
                    }`}
                  >
                    {task.completed && (
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    )}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <p 
                      className={`text-sm sm:text-lg cursor-pointer break-words transition-colors ${
                        task.completed 
                          ? 'line-through text-gray-400' 
                          : isDarkMode ? 'text-gray-100' : 'text-gray-800'
                      }`}
                      onClick={() => handleComplete(task.id, task.completed)}
                    >
                      {task.text}
                    </p>
                    <p className={`text-xs sm:text-sm mt-1 transition-colors ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {formatDate(task.createdAt)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(task)}
                    className={`p-1.5 sm:p-2 text-blue-600 rounded-full transition-colors hover:scale-110 ${
                      isDarkMode ? 'hover:bg-blue-900/30' : 'hover:bg-blue-50'
                    }`}
                    title="Edit task"
                  >
                    <Edit2 size={16} className="sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className={`p-1.5 sm:p-2 text-red-600 rounded-full transition-colors hover:scale-110 ${
                      isDarkMode ? 'hover:bg-red-900/30' : 'hover:bg-red-50'
                    }`}
                    title="Delete task"
                  >
                    <Trash2 size={16} className="sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {tasks.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
              isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              <Plus className={`w-8 h-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            </div>
            <p className={`text-lg mb-2 transition-colors ${
              isDarkMode ? 'text-gray-300' : 'text-gray-500'
            }`}>No tasks yet</p>
            <p className={`text-sm transition-colors ${
              isDarkMode ? 'text-gray-500' : 'text-gray-400'
            }`}>Add your first task to get started!</p>
          </div>
        )}
        
        <div className="mt-6 sm:mt-8">
          <AddTaskButton />
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-xl shadow-xl w-full max-w-md mx-4 transform transition-all ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6">
              <h2 className={`text-xl font-semibold mb-4 transition-colors ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>Edit Task</h2>
              
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 transition-colors ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Task Description
                </label>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  rows="3"
                  placeholder="Enter your task..."
                  autoFocus
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleSaveEdit}
                  disabled={editText.trim() === ''}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Check size={16} />
                  Save Changes
                </button>
                <button
                  onClick={handleCancelEdit}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-600 text-gray-200 hover:bg-gray-700' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`rounded-xl shadow-xl w-full max-w-md mx-4 transform transition-all ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h2 className={`text-xl font-semibold transition-colors ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>Delete Task</h2>
              </div>
              
              <p className={`mb-6 transition-colors ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Are you sure you want to delete this task? This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={confirmDelete}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
                <button
                  onClick={cancelDelete}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-600 text-gray-200 hover:bg-gray-700' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};