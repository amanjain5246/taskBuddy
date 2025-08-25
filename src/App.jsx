import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Save, Download, Filter, X, Moon, Sun, Zap } from 'lucide-react';

export default function TaskBuddy() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Personal');
  const [filterCategory, setFilterCategory] = useState('All');
  const [lastSaved, setLastSaved] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showStats, setShowStats] = useState(true);

  const categories = ['Personal', 'Work', 'Health', 'Shopping', 'Learning'];

  // Load preferences on mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('taskBuddy-darkMode');
    const savedShowStats = localStorage.getItem('taskBuddy-showStats');
    if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode));
    if (savedShowStats) setShowStats(JSON.parse(savedShowStats));
  }, []);

  // Save preferences when changed
  useEffect(() => {
    localStorage.setItem('taskBuddy-darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('taskBuddy-showStats', JSON.stringify(showStats));
  }, [showStats]);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('taskBuddy-tasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        setTasks(parsedTasks);
        setLastSaved(localStorage.getItem('taskBuddy-lastSaved'));
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('taskBuddy-tasks', JSON.stringify(tasks));
      const now = new Date().toLocaleString();
      localStorage.setItem('taskBuddy-lastSaved', now);
      setLastSaved(now);
    }
  }, [tasks]);

  const addTask = () => {
    if (inputValue.trim() !== '') {
      const newTask = {
        id: Date.now(),
        text: inputValue.trim(),
        category: selectedCategory,
        completed: false,
        createdAt: new Date().toISOString()
      };
      setTasks([...tasks, newTask]);
      setInputValue('');
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const clearAllTasks = () => {
    if (window.confirm('Are you sure you want to clear all tasks? This cannot be undone.')) {
      setTasks([]);
      localStorage.removeItem('taskBuddy-tasks');
      localStorage.removeItem('taskBuddy-lastSaved');
      setLastSaved(null);
    }
  };

  const exportTasks = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `taskbuddy-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Filter tasks based on selected category
  const filteredTasks = filterCategory === 'All' 
    ? tasks 
    : tasks.filter(task => task.category === filterCategory);

  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      'Personal': 'bg-blue-100 text-blue-800',
      'Work': 'bg-purple-100 text-purple-800',
      'Health': 'bg-green-100 text-green-800',
      'Shopping': 'bg-yellow-100 text-yellow-800',
      'Learning': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className={`min-h-screen transition-all duration-300 p-4 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`}>
      <div className="max-w-4xl mx-auto">
        {/* Header with Settings */}
        <div className="text-center mb-8 relative">
          <div className="absolute top-0 right-0 flex gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-xl transition-all duration-200 ${
                darkMode 
                  ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 shadow-lg'
              }`}
              title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setShowStats(!showStats)}
              className={`p-3 rounded-xl transition-all duration-200 ${
                darkMode 
                  ? 'bg-gray-700 text-blue-400 hover:bg-gray-600' 
                  : 'bg-white text-blue-600 hover:bg-gray-100 shadow-lg'
              }`}
              title={`${showStats ? 'Hide' : 'Show'} statistics`}
            >
              <Zap size={20} />
            </button>
          </div>
          
          <div className="animate-fade-in">
            <h1 className={`text-5xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
              TaskBuddy
            </h1>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Your intelligent task management companion
            </p>
          </div>
        </div>

        {/* Add Task Section */}
        <div className={`rounded-2xl shadow-xl p-6 mb-6 backdrop-blur-sm transition-all duration-300 transform hover:scale-[1.02] ${
          darkMode 
            ? 'bg-gray-800/80 border border-gray-700' 
            : 'bg-white/80 border border-white/50'
        }`}>
          <div className="flex gap-3 mb-4 flex-wrap">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="What needs to be done?"
              className={`flex-1 min-w-[200px] px-5 py-4 rounded-xl border-2 transition-all duration-200 focus:scale-[1.02] ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:bg-gray-600'
                  : 'bg-white border-gray-200 text-gray-800 placeholder-gray-500 focus:border-blue-400 focus:bg-blue-50'
              } focus:outline-none focus:ring-2 focus:ring-blue-400/20`}
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={`px-4 py-4 rounded-xl border-2 transition-all duration-200 ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400'
                  : 'bg-white border-gray-200 text-gray-800 focus:border-blue-400'
              } focus:outline-none focus:ring-2 focus:ring-blue-400/20`}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <button
              onClick={addTask}
              disabled={!inputValue.trim()}
              className={`px-6 py-4 rounded-xl transition-all duration-200 flex items-center gap-2 font-medium transform hover:scale-105 ${
                inputValue.trim()
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Add Task</span>
            </button>
          </div>
          
          {/* Data Management Buttons */}
          {tasks.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={exportTasks}
                className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium hover:scale-105 ${
                  darkMode
                    ? 'bg-green-600 hover:bg-green-500 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                } shadow-lg`}
              >
                <Download size={16} />
                Export
              </button>
              <button
                onClick={clearAllTasks}
                className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium hover:scale-105 ${
                  darkMode
                    ? 'bg-red-600 hover:bg-red-500 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                } shadow-lg`}
              >
                <Trash2 size={16} />
                Clear All
              </button>
              {lastSaved && (
                <div className={`flex items-center gap-2 text-sm ml-auto ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <Save size={16} />
                  <span className="hidden md:inline">Last saved: {lastSaved}</span>
                  <span className="md:hidden">Saved</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Filter Section */}
        {tasks.length > 0 && (
          <div className={`rounded-2xl shadow-xl p-4 mb-6 backdrop-blur-sm transition-all duration-300 ${
            darkMode 
              ? 'bg-gray-800/80 border border-gray-700' 
              : 'bg-white/80 border border-white/50'
          }`}>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter size={18} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
                <span className={`font-medium hidden sm:inline ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Filter:
                </span>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setFilterCategory('All')}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                    filterCategory === 'All'
                      ? darkMode
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-800 text-white shadow-lg'
                      : darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All <span className="opacity-75">({tasks.length})</span>
                </button>
                
                {categories.map(category => {
                  const count = tasks.filter(task => task.category === category).length;
                  return count > 0 ? (
                    <button
                      key={category}
                      onClick={() => setFilterCategory(category)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                        filterCategory === category
                          ? darkMode
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-gray-800 text-white shadow-lg'
                          : darkMode
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category} <span className="opacity-75">({count})</span>
                    </button>
                  ) : null;
                })}
              </div>
              
              {filterCategory !== 'All' && (
                <button
                  onClick={() => setFilterCategory('All')}
                  className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                    darkMode 
                      ? 'text-gray-400 hover:bg-gray-700 hover:text-white' 
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                  title="Clear filter"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tasks List */}
        <div className={`rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm transition-all duration-300 ${
          darkMode 
            ? 'bg-gray-800/80 border border-gray-700' 
            : 'bg-white/80 border border-white/50'
        }`}>
          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center">
              <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <Check size={28} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
              </div>
              {tasks.length === 0 ? (
                <div className="animate-fade-in">
                  <p className={`text-xl font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Ready to get productive?
                  </p>
                  <p className={`${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Add your first task above to get started on your journey!
                  </p>
                </div>
              ) : (
                <div className="animate-fade-in">
                  <p className={`text-xl font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    No {filterCategory.toLowerCase()} tasks found!
                  </p>
                  <p className={`${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Try a different category or add a new task.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredTasks.map((task, index) => (
                <div
                  key={task.id}
                  className={`p-6 flex items-center gap-4 transition-all duration-200 hover:scale-[1.02] transform animate-slide-in ${
                    task.completed ? 'opacity-60' : ''
                  } ${
                    darkMode 
                      ? 'hover:bg-gray-700/50' 
                      : 'hover:bg-blue-50/50'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Enhanced Checkbox */}
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
                      task.completed
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-500 text-white shadow-lg'
                        : darkMode
                          ? 'border-gray-600 hover:border-green-400 hover:bg-green-400/10'
                          : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
                    }`}
                  >
                    {task.completed && <Check size={18} className="animate-bounce-in" />}
                  </button>

                  {/* Enhanced Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <p
                        className={`text-lg font-medium break-words transition-all duration-200 ${
                          task.completed
                            ? darkMode 
                              ? 'line-through text-gray-500'
                              : 'line-through text-gray-500'
                            : darkMode
                              ? 'text-gray-100'
                              : 'text-gray-800'
                        }`}
                      >
                        {task.text}
                      </p>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 transform hover:scale-105 ${getCategoryColor(task.category)} ${
                        darkMode ? 'opacity-90' : ''
                      }`}>
                        {task.category}
                      </span>
                    </div>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      Created {new Date(task.createdAt).toLocaleDateString()} at {new Date(task.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                  </div>

                  {/* Enhanced Delete Button */}
                  <button
                    onClick={() => deleteTask(task.id)}
                    className={`p-3 rounded-xl transition-all duration-200 transform hover:scale-110 ${
                      darkMode
                        ? 'text-red-400 hover:bg-red-900/30 hover:text-red-300'
                        : 'text-red-500 hover:bg-red-50 hover:text-red-600'
                    } group`}
                    title="Delete task"
                  >
                    <Trash2 size={18} className="group-hover:animate-wiggle" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Stats */}
        {tasks.length > 0 && showStats && (
          <div className={`mt-6 rounded-2xl shadow-xl p-6 backdrop-blur-sm transition-all duration-300 animate-fade-in ${
            darkMode 
              ? 'bg-gray-800/80 border border-gray-700' 
              : 'bg-white/80 border border-white/50'
          }`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center group cursor-pointer">
                <div className={`text-3xl font-bold mb-1 transition-all duration-200 group-hover:scale-110 ${
                  darkMode ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  {tasks.length}
                </div>
                <div className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Tasks
                </div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className={`text-3xl font-bold mb-1 transition-all duration-200 group-hover:scale-110 ${
                  darkMode ? 'text-green-400' : 'text-green-600'
                }`}>
                  {tasks.filter(t => t.completed).length}
                </div>
                <div className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Completed
                </div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className={`text-3xl font-bold mb-1 transition-all duration-200 group-hover:scale-110 ${
                  darkMode ? 'text-orange-400' : 'text-orange-600'
                }`}>
                  {tasks.filter(t => !t.completed).length}
                </div>
                <div className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Remaining
                </div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className={`text-3xl font-bold mb-1 transition-all duration-200 group-hover:scale-110 ${
                  darkMode ? 'text-purple-400' : 'text-purple-600'
                }`}>
                  {Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) || 0}%
                </div>
                <div className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Progress
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className={`mt-6 rounded-full h-3 overflow-hidden ${
              darkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ease-out"
                style={{ 
                  width: `${tasks.length > 0 ? (tasks.filter(t => t.completed).length / tasks.length) * 100 : 0}%` 
                }}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes bounce-in {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        @keyframes wiggle {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(-3deg); }
          75% { transform: rotate(3deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-slide-in { animation: slide-in 0.5s ease-out; }
        .animate-bounce-in { animation: bounce-in 0.4s ease-out; }
        .animate-wiggle:hover { animation: wiggle 0.3s ease-in-out; }
      `}</style>
    </div>
  );
}