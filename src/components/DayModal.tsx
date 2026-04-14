import React, { useState, useEffect } from 'react';
import type { Holiday, Task } from '../interfaces';
import TaskItem from './TaskItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faClipboardList, faPlus } from '@fortawesome/free-solid-svg-icons';

interface DayModalProps {
  date: Date;
  tasks: Task[];
  holidays?: Holiday[];
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
}

const DayModal: React.FC<DayModalProps> = ({ date, tasks, holidays = [], onClose, onAddTask, onToggleComplete, onDelete, onEdit }) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');

  const hasHoliday = holidays.length > 0;

  // Focus input automatically
  useEffect(() => {
    const input = document.getElementById('task-title-input');
    input?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask({
      title,
      // Ensure the date string is correctly stored according to the local timezone
      date: new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split('T')[0],
      time: time || undefined,
      priority,
    });
    setTitle('');
    setTime('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-all duration-300" onClick={onClose}>
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="w-full max-w-lg max-h-[90vh] flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-2xl transition-all border border-gray-100 dark:border-gray-700 overflow-hidden"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 sm:p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              {date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} on this day
            </p>

            {hasHoliday && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {holidays.map(h => (
                  <span
                    key={`${h.date}-${h.name}`}
                    className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60"
                    title={`${h.name} (${h.type})`}
                  >
                    {h.name} • {h.type === 'Regular' ? 'Regular' : h.type === 'SpecialNonWorking' ? 'Special (Non-Working)' : h.type === 'SpecialWorking' ? 'Special (Working)' : 'Holiday'}
                  </span>
                ))}
              </div>
            )}
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="p-2 flex-shrink-0 text-gray-400 hover:text-gray-800 dark:text-gray-500 dark:hover:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full transition-all w-9 h-9 flex items-center justify-center"
            title="Close"
          >
            <FontAwesomeIcon icon={faTimes} className="text-lg" />
          </button>
        </div>

        {/* Task History List */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-grow flex flex-col gap-2 min-h-[200px] bg-white dark:bg-gray-800">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 py-8">
              <FontAwesomeIcon icon={faClipboardList} className="text-5xl mb-3 opacity-50" />
              <p>No tasks added yet.</p>
            </div>
          ) : (
            tasks.map(task => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onToggleComplete={onToggleComplete} 
                onDelete={onDelete} 
                onEdit={onEdit}
              />
            ))
          )}
        </div>

        {/* Add New Task Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
            Add New Task
          </h3>
          <div className="flex flex-col gap-3">
            <input
              id="task-title-input"
              type="text"
              placeholder="Add Task"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 sm:p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
            />
            
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full sm:w-1/2 p-2.5 sm:p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all"
              />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'Low' | 'Medium' | 'High')}
                className="w-full sm:w-1/2 p-2.5 sm:p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all cursor-pointer"
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="w-full py-2.5 px-4 sm:px-6 text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-xl font-medium transition-all shadow-md shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faPlus} />
              <span>Add Task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DayModal;
