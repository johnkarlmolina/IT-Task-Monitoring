import React, { useState, useEffect } from 'react';
import type { Task } from '../interfaces';

interface TaskFormProps {
  onAddTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  selectedDate: Date;
  onClose: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask, selectedDate, onClose }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');

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
      date: new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0],
      priority,
    });
    setTitle('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-all duration-300" onClick={onClose}>
      <form 
        onSubmit={handleSubmit} 
        onClick={(e) => e.stopPropagation()} 
        className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl transition-all border border-gray-100 dark:border-gray-700"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Add Task for {selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </h2>
          <button 
            type="button" 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Task Title</label>
          <input
            id="task-title-input"
            type="text"
            placeholder="e.g., pm, meeting, groceries"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'Low' | 'Medium' | 'High')}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all appearance-none"
          >
            <option value="Low">🟢 Low</option>
            <option value="Medium">🟡 Medium</option>
            <option value="High">🔴 High</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button 
            type="button" 
            onClick={onClose}
            className="flex-1 p-3 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-medium transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="flex-1 p-3 text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-xl font-medium transition-colors shadow-md shadow-blue-500/30 dark:shadow-blue-900/30"
          >
            Add Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
