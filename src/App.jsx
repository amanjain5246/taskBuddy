import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Save, Download, Filter, X } from 'lucide-react';

export default function TaskBuddy() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Personal');
  const [filterCategory, setFilterCategory] = useState('All');
  const [lastSaved, setLastSaved] = useState(null);

  const categories = ['Personal', 'Work', 'Health', 'Shopping', 'Learning'];

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">TaskBuddy</h1>
          <p className="text-gray-600">Your personal task management companion</p>
        </div>

        {/* Add Task Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <button
              onClick={addTask}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <Plus size={20} />
              Add Task
            </button>
          </div>
          
          {/* Data Management Buttons */}
          {tasks.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={exportTasks}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm"
              >
                <Download size={16} />
                Export Tasks
              </button>
              <button
                onClick={clearAllTasks}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm"
              >
                <Trash2 size={16} />
                Clear All
              </button>
              {lastSaved && (
                <div className="flex items-center gap-2 text-sm text-gray-500 ml-auto">
                  <Save size={16} />
                  Last saved: {lastSaved}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Filter Section */}
        {tasks.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-600" />
                <span className="text-gray-700 font-medium">Filter by:</span>
              </div>
              
              <button
                onClick={() => setFilterCategory('All')}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  filterCategory === 'All'
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({tasks.length})
              </button>
              
              {categories.map(category => {
                const count = tasks.filter(task => task.category === category).length;
                return count > 0 ? (
                  <button
                    key={category}
                    onClick={() => setFilterCategory(category)}
                    className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 ${
                      filterCategory === category
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category} ({count})
                  </button>
                ) : null;
              })}
              
              {filterCategory !== 'All' && (
                <button
                  onClick={() => setFilterCategory('All')}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  title="Clear filter"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tasks List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Check size={24} className="text-gray-400" />
              </div>
              {tasks.length === 0 ? (
                <>
                  <p className="text-lg">No tasks yet!</p>
                  <p className="text-sm">Add your first task above to get started.</p>
                </>
              ) : (
                <>
                  <p className="text-lg">No {filterCategory.toLowerCase()} tasks!</p>
                  <p className="text-sm">Try a different category or add a new task.</p>
                </>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors duration-150 ${
                    task.completed ? 'opacity-75' : ''
                  }`}
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      task.completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    {task.completed && <Check size={16} />}
                  </button>

                  {/* Task Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p
                        className={`text-lg ${
                          task.completed
                            ? 'line-through text-gray-500'
                            : 'text-gray-800'
                        }`}
                      >
                        {task.text}
                      </p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}>
                        {task.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Created: {new Date(task.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        {tasks.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{tasks.length}</div>
                <div className="text-sm text-gray-600">Total Tasks</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{tasks.filter(t => t.completed).length}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{tasks.filter(t => !t.completed).length}</div>
                <div className="text-sm text-gray-600">Remaining</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {filterCategory === 'All' ? categories.length : 1}
                </div>
                <div className="text-sm text-gray-600">
                  {filterCategory === 'All' ? 'Categories' : 'Category'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}