import React from 'react';
import type { Holiday, Task } from '../interfaces';
import CalendarDay from './CalendarDay';

interface CalendarGridProps {
  date: Date;
  tasks: Task[];
  holidays?: Holiday[];
  onDayClick: (date: Date) => void;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ date, tasks, holidays = [], onDayClick, onToggleComplete, onDelete, onEdit }) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  
  const daysInMonth = lastDayOfMonth.getDate();
  const startDayOfWeek = firstDayOfMonth.getDay();

  const days = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(
      <div key={`empty-${i}`} className="p-2 h-[100px] sm:h-[120px] bg-gray-50/50 dark:bg-gray-800/20 border border-gray-100 dark:border-gray-700/50 rounded-xl m-1"></div>
    );
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const rawDate = new Date(year, month, i);
    // Ensure accurate local ISO string mapping for the date comparison
    const localDateStr = new Date(rawDate.getTime() - (rawDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
    
    // Filter tasks that match this day exactly
    const dayTasks = tasks.filter(task => task.date === localDateStr);
    const dayHolidays = holidays.filter(h => h.date === localDateStr);
    
    days.push(
      <CalendarDay
        key={i}
        day={rawDate}
        tasks={dayTasks}
        holidays={dayHolidays}
        onDayClick={onDayClick}
        onToggleComplete={onToggleComplete}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    );
  }

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="w-full flex-grow flex flex-col mx-auto bg-white dark:bg-gray-800 rounded-3xl pb-2 transition-colors duration-300">
      <div className="grid grid-cols-7 gap-2 mb-2">
        {daysOfWeek.map(day => (
          <div key={day} className="font-semibold text-center text-sm md:text-base text-gray-500 dark:text-gray-400 tracking-wide uppercase px-2 py-4">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-2 flex-grow auto-rows-fr">
        {days}
      </div>
    </div>
  );
};

export default CalendarGrid;
