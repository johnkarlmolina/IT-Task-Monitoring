import React, { useState } from 'react';
import type { Task } from '../interfaces';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faInfoCircle, faExclamationCircle, faExclamationTriangle, faEdit, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit?: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editTime, setEditTime] = useState(task.time || '');
  const [editPriority, setEditPriority] = useState(task.priority);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editTitle.trim()) return;
    if (onEdit) {
      onEdit({ ...task, title: editTitle, time: editTime || undefined, priority: editPriority });
    }
    setIsEditing(false);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditTitle(task.title);
    setEditTime(task.time || '');
    setEditPriority(task.priority);
    setIsEditing(false);
  };

  const formatTime = (time?: string) => {
    if (!time) return '';
    const [h, m] = time.split(':');
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${m} ${ampm}`;
  };

  const priorityConfig = {
    Low: { 
      color: 'bg-emerald-500', 
      text: 'text-emerald-700 dark:text-emerald-400', 
      bg: 'bg-emerald-50 dark:bg-emerald-900/20', 
      border: 'border-emerald-200 dark:border-emerald-800',
      icon: faInfoCircle
    },
    Medium: { 
      color: 'bg-amber-500', 
      text: 'text-amber-700 dark:text-amber-400', 
      bg: 'bg-amber-50 dark:bg-amber-900/20', 
      border: 'border-amber-200 dark:border-amber-800',
      icon: faExclamationCircle
    },
    High: { 
      color: 'bg-rose-500', 
      text: 'text-rose-700 dark:text-rose-400', 
      bg: 'bg-rose-50 dark:bg-rose-900/20', 
      border: 'border-rose-200 dark:border-rose-800',
      icon: faExclamationTriangle
    },
  };

  const scheme = priorityConfig[task.priority] || priorityConfig.Medium;

  if (isEditing) {
    return (
      <div 
        className={`relative flex flex-col gap-2 p-2 rounded-lg border text-xs sm:text-sm shadow-md transition-all duration-200 z-50
          ${scheme.bg} ${scheme.border} w-full min-w-[200px]`}
        onClick={(e) => e.stopPropagation()}
      >
        <input 
          type="text" 
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          className="w-full p-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          autoFocus
        />
        <div className="flex gap-2">
          <input 
            type="time" 
            value={editTime}
            onChange={e => setEditTime(e.target.value)}
            className="w-1/2 p-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <select 
            value={editPriority}
            onChange={e => setEditPriority(e.target.value as 'Low' | 'Medium' | 'High')}
            className="w-1/2 p-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div className="flex justify-end gap-1 mt-1">
          <button onClick={handleCancel} className="p-1.5 px-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded text-gray-700 dark:text-gray-200 flex items-center justify-center gap-1 transition-colors">
            <FontAwesomeIcon icon={faTimes} className="text-xs" /> Cancel
          </button>
          <button onClick={handleSave} className="p-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center gap-1 transition-colors">
            <FontAwesomeIcon icon={faCheck} className="text-xs" /> Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`group relative flex flex-col justify-center py-1.5 px-2 rounded-lg border text-xs sm:text-sm shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-200
        ${task.completed ? 'opacity-50 grayscale bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/50' : `${scheme.bg} ${scheme.border} hover:shadow-md hover:-translate-y-0.5`}`}
      onClick={(e) => {
        // Prevent click from bubbling up to the CalendarDay
        e.stopPropagation();
      }}
    >
      <div className="flex items-start justify-between w-full">
        <label className="flex items-start gap-2.5 cursor-pointer w-full group min-w-0">
          <input 
            type="checkbox" 
            checked={task.completed} 
            onChange={() => onToggleComplete(task.id)}
            className="mt-0.5 w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400 dark:ring-offset-gray-800 cursor-pointer shrink-0"
          />
          <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
            <span className={`font-semibold leading-tight break-words pr-1 ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : scheme.text}`} title={task.title}>
              {task.title}
            </span>
            {task.time && (
              <span className={`text-[10px] mt-0.5 opacity-80 ${task.completed ? 'text-gray-400' : scheme.text} font-medium`}>
                {formatTime(task.time)}
              </span>
            )}
          </div>
        </label>

        <div className="flex bg-white/50 dark:bg-gray-800/50 rounded pointer-events-none opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-all ml-1 flex-shrink-0 mt-[-2px] border border-transparent group-hover:border-gray-200 dark:group-hover:border-gray-700">
          {onEdit && (
            <button 
              onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} 
              className="text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 p-1.5 rounded-l-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              title="Edit task"
            >
              <FontAwesomeIcon icon={faEdit} className="text-xs" />
            </button>
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(task.id); }} 
            className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 p-1.5 rounded-r-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-l border-transparent group-hover:border-gray-200 dark:group-hover:border-gray-700"
            title="Delete task"
          >
            <FontAwesomeIcon icon={faTrash} className="text-xs" />
          </button>
        </div>
      </div>

      <div className={`mt-1.5 flex items-center justify-between`}>
        <div className={`h-1 w-6 rounded-full ${task.completed ? 'bg-gray-300 dark:bg-gray-600' : scheme.color}`}></div>
        <FontAwesomeIcon 
          icon={scheme.icon} 
          className={`text-[10px] sm:text-xs opacity-70 ${task.completed ? 'text-gray-400' : scheme.text}`} 
        />
      </div>
    </div>
  );
};

export default TaskItem;
