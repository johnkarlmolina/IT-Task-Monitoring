import React from 'react';
import type { Holiday, Task } from '../interfaces';
import TaskItem from './TaskItem';

interface CalendarDayProps {
  day: Date;
  tasks: Task[];
  holidays?: Holiday[];
  onDayClick: (date: Date) => void;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ day, tasks, holidays = [], onDayClick, onToggleComplete, onDelete, onEdit }) => {
  const isToday = new Date().toDateString() === day.toDateString();
  const hasHoliday = holidays.length > 0;

  return (
    <div 
      className={`relative group rounded-2xl p-2 flex flex-col transition-all duration-300 cursor-pointer overflow-hidden ${
        isToday 
          ? 'bg-blue-50 dark:bg-blue-900/60 border-4 border-blue-500 scale-[1.10] sm:scale-[1.15] z-50 shadow-2xl shadow-blue-500/30 h-[130px] sm:h-[150px]' 
          : `bg-white border dark:bg-gray-800 border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-200 h-[100px] sm:h-[120px] ${hasHoliday ? 'ring-2 ring-purple-200 dark:ring-purple-700/60' : ''}`
      }`} 
      onClick={() => onDayClick(day)}
    >
      <div className="flex justify-between items-start mb-2">
        <span 
          className={`flex justify-center items-center rounded-full font-bold transition-colors ${
            isToday 
              ? 'h-9 w-9 sm:h-11 sm:w-11 text-sm sm:text-base bg-blue-600 text-white shadow-lg shadow-blue-500/40' 
              : 'h-7 w-7 sm:h-8 sm:w-8 text-xs sm:text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400'
          }`}
        >
          {day.getDate()}
        </span>
        <div className="flex flex-col items-end gap-1 mr-1 min-w-0">
          {hasHoliday && (
            <span
              className="max-w-[90px] sm:max-w-[110px] truncate px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60"
              title={holidays.map(h => h.name).join(' • ')}
            >
              {holidays.length === 1 ? holidays[0].name : `${holidays.length} holidays`}
            </span>
          )}
          <button 
            className="text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
            title="Add task"
          >
            +
          </button>
        </div>
      </div>

      <div 
        className="flex-grow overflow-y-auto pr-1 space-y-1.5 
          [&::-webkit-scrollbar]:w-1 
          [&::-webkit-scrollbar-thumb]:bg-gray-200 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600
          [&::-webkit-scrollbar-thumb]:rounded-full 
          hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-500"
      >
        {tasks.map((task, index) => (
          <TaskItem key={task.id || index} task={task} onToggleComplete={onToggleComplete} onDelete={onDelete} onEdit={onEdit} />
        ))}
      </div>
    </div>
  );
};

export default CalendarDay;
