import React, { useState, useEffect } from 'react';
import CalendarGrid from './components/CalendarGrid';
import DayModal from './components/DayModal';
import DayView from './components/DayView';
import type { Task } from './interfaces';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faSun, faMoon, faCalendarDay, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

type ViewMode = 'month' | 'day';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== 'undefined') {
      const storedTasks = localStorage.getItem('tasks');
      if (storedTasks) {
        try {
          return JSON.parse(storedTasks);
        } catch (e) {
          console.error("Failed to parse stored tasks");
        }
      }
    }
    return [];
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check initial local storage or default to false
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddTask = (task: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now(),
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setSelectedDate(null);
  };

  const handleToggleComplete = (id: number) => {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleEditTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const handleDelete = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const goToPrevious = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1));
    }
  };

  const goToNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1));
    }
  };

  const setToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className={`min-h-screen font-sans p-4 md:p-6 flex flex-col font-inter antialiased transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="w-full flex-grow flex flex-col max-w-[1600px] mx-auto h-full">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 bg-white dark:bg-gray-800 px-6 py-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={setToday}
              className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              Today
            </button>
            <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl items-center">
              <button 
                onClick={goToPrevious} 
                className="p-2 w-9 h-9 flex items-center justify-center hover:bg-white dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-200 transition-all font-medium"
                aria-label="Previous"
              >
                <FontAwesomeIcon icon={faChevronLeft} className="text-sm" />
              </button>
              <button 
                onClick={goToNext} 
                className="p-2 w-9 h-9 flex items-center justify-center hover:bg-white dark:hover:bg-gray-600 rounded-lg text-gray-700 dark:text-gray-200 transition-all font-medium"
                aria-label="Next"
              >
                <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
              </button>
            </div>
            
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100 ml-4 hidden md:block">
              {viewMode === 'month' 
                ? currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
                : currentDate.toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric' })
              }
            </h1>
          </div>
          
          <div className="flex items-center justify-between w-full sm:w-auto gap-3">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100 block md:hidden">
              {viewMode === 'month' 
                ? currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
                : currentDate.toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric' })
              }
            </h1>
            
            {/* View Mode Dropdown / Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
              <button 
                onClick={() => setViewMode('day')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${viewMode === 'day' ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'}`}
              >
                <FontAwesomeIcon icon={faCalendarDay} />
                <span className="hidden lg:inline">Day</span>
              </button>
              <button 
                onClick={() => setViewMode('month')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${viewMode === 'month' ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'}`}
              >
                <FontAwesomeIcon icon={faCalendarAlt} />
                <span className="hidden lg:inline">Month</span>
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 w-[38px] h-[38px] rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center border border-gray-200 dark:border-gray-600"
              aria-label="Toggle dark mode"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? (
                <FontAwesomeIcon icon={faSun} className="text-md text-yellow-400" />
              ) : (
                <FontAwesomeIcon icon={faMoon} className="text-md text-indigo-600" />
              )}
            </button>
          </div>
        </div>

        {/* Main Calendar View Area */}
        <div className="flex-grow flex flex-col min-h-0 bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 p-2 md:p-4 transition-colors duration-300 overflow-hidden">
          {viewMode === 'month' ? (
            <CalendarGrid
              date={currentDate}
              tasks={tasks}
              onDayClick={handleDayClick}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDelete}
              onEdit={handleEditTask}
            />
          ) : (
            <DayView
              date={currentDate}
              tasks={tasks.filter(t => t.date === new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0])}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDelete}
              onDayClick={handleDayClick}
              onEdit={handleEditTask}
            />
          )}
        </div>

        {selectedDate && (
          <DayModal 
            date={selectedDate} 
            tasks={tasks.filter(t => t.date === new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0])}
            onAddTask={handleAddTask} 
            onToggleComplete={handleToggleComplete}
            onDelete={handleDelete}
            onClose={() => setSelectedDate(null)} 
            onEdit={handleEditTask}
          />
        )}
      </div>
    </div>
  );
};

export default App;
