import React, { useState, useEffect, useRef } from 'react';
import type { Holiday, Task } from '../interfaces';
import TaskItem from './TaskItem';

interface DayViewProps {
  date: Date;
  tasks: Task[];
  holidays?: Holiday[];
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onDayClick: (date: Date) => void;
  onEdit: (task: Task) => void;
}

const DayView: React.FC<DayViewProps> = ({ date, tasks, holidays = [], onToggleComplete, onDelete, onDayClick, onEdit }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Update the red indicator every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to roughly the current time on mount if it's "today"
  useEffect(() => {
    if (containerRef.current) {
      const isToday = new Date().toDateString() === date.toDateString();
      if (isToday) {
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        const top = (hours * 60 + minutes); // Height corresponds strictly right now.
        // Assuming each hour is 60px (1px per minute) -> standard GCal scaling
        const scrollPosition = top - window.innerHeight / 3;
        containerRef.current.scrollTop = scrollPosition > 0 ? scrollPosition : 0;
      }
    }
  }, [date]);

  const isToday = new Date().toDateString() === date.toDateString();
  const hasHoliday = holidays.length > 0;

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getRedLinePosition = () => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    return hours * 60 + minutes; // 1px per minute
  };

  const getTaskTopPosition = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  const dayOfWeekNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const timedTasks = tasks.filter(t => t.time);
  const allDayTasks = tasks.filter(t => !t.time);

  // Group tasks by exact start time to prevent overlap
  const getTasksWithPositions = () => {
    const grouped: { [key: string]: Task[] } = {};
    timedTasks.forEach(task => {
      const time = task.time!;
      if (!grouped[time]) {
        grouped[time] = [];
      }
      grouped[time].push(task);
    });

    const tasksWithPos: Array<{task: Task, width: string, left: string}> = [];
    Object.keys(grouped).forEach(time => {
      const tasksAtTime = grouped[time];
      const count = tasksAtTime.length;
      tasksAtTime.forEach((task, index) => {
        tasksWithPos.push({
          task,
          width: `calc(${100 / count}% - 8px)`,
          left: `calc(${(100 / count) * index}% + 4px)`
        });
      });
    });
    return tasksWithPos;
  };

  const tasksWithPositions = getTasksWithPositions();

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm w-full overflow-hidden border border-gray-200 dark:border-gray-700">
      
      {/* Date Header Strip */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {/* Timezone spacer */}
        <div className="w-16 border-r border-gray-200 dark:border-gray-700 flex items-end justify-end pb-2 pr-2 text-xs text-gray-400">
          GMT+08
        </div>
        
        {/* Day Column Header */}
        <div className="flex-1 min-w-[200px] border-r border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center py-2 h-[80px]">
          <span className={`text-[11px] font-medium tracking-wide mb-1 ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
            {dayOfWeekNames[date.getDay()]}
          </span>
          <div className={`h-[46px] w-[46px] rounded-full flex items-center justify-center text-[24px] font-medium ${isToday ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition'}`}>
            {date.getDate()}
          </div>

          {hasHoliday && (
            <div className="mt-2 flex flex-wrap justify-center gap-1.5 px-3">
              {holidays.map(h => (
                <span
                  key={`${h.date}-${h.name}`}
                  className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 max-w-[260px] truncate"
                  title={`${h.name} (${h.type})`}
                >
                  {h.name} • {h.type === 'Regular' ? 'Regular' : h.type === 'SpecialNonWorking' ? 'Special (Non-Working)' : h.type === 'SpecialWorking' ? 'Special (Working)' : 'Holiday'}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* All-Day Tasks Section */}
      {allDayTasks.length > 0 && (
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shrink-0">
          <div className="w-16 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center py-2 text-[10px] text-gray-500 font-medium">
            <span className="hidden sm:inline">all-day</span>
          </div>
          <div className="flex-1 p-1 flex pl-4 pt-2 gap-2 overflow-x-auto">
            {allDayTasks.map(task => (
              <div key={task.id} className="w-[200px] sm:w-[250px] shrink-0 inline-block align-top">
                <TaskItem task={task} onToggleComplete={onToggleComplete} onDelete={onDelete} onEdit={onEdit} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scrollable Time Grid */}
      <div ref={containerRef} className="flex-1 overflow-y-auto relative bg-white dark:bg-gray-800">
        
        {/* Time Labels Column */}
        <div className="absolute left-0 top-0 bottom-0 w-16 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 z-10">
          {hours.map((hour) => {
            if (hour === 0) return <div key={hour} className="h-[60px]"></div>; // 12 AM isn't typically shown at the very top line in GCal, or shown as empty
            const displayHour = hour > 12 ? hour - 12 : hour;
            const ampm = hour >= 12 ? 'PM' : 'AM';
            return (
              <div key={hour} className="h-[60px] relative text-[10px] text-gray-500 font-medium text-right pr-2">
                <span className="relative -top-2">{`${displayHour} ${ampm}`}</span>
              </div>
            );
          })}
        </div>

        {/* Guidelines and Tasks Canvas */}
        <div 
          className="ml-16 relative w-full border-r border-gray-200 dark:border-gray-700 cursor-pointer" 
          style={{ height: `${24 * 60}px` }}
          onClick={(e) => {
            // Prevent if cliking on a task
            if (e.target === e.currentTarget) {
              onDayClick(date);
            }
          }}
        >
          {/* Hour grid lines */}
          {hours.map((hour) => (
            <div 
              key={hour} 
              className="absolute left-0 right-0 border-t border-gray-200 dark:border-gray-700 z-0 pointer-events-none"
              style={{ top: `${hour * 60}px` }}
            >
              {/* Optional Half hour line */}
              {/* <div className="absolute top-[30px] left-0 right-0 border-t border-dashed border-gray-100 dark:border-gray-800 pointer-events-none"></div> */}
            </div>
          ))}

          {/* Current Time Red Line */}
          {isToday && (
            <div 
              className="absolute left-0 right-0 z-20 pointer-events-none flex items-center"
              style={{ top: `${getRedLinePosition()}px` }}
            >
              {/* Red dot */}
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full -ml-[5px] absolute shadow-sm"></div>
              {/* Red line */}
              <div className="h-[2px] bg-red-500 w-full shadow-sm"></div>
            </div>
          )}

          {/* Render Timed Tasks */}
          {tasksWithPositions.map(({ task, width, left }) => (
            <div 
              key={task.id} 
              className="absolute pointer-events-auto z-10 hover:z-20 transition-all rounded-md overflow-hidden bg-opacity-95"
              style={{ 
                top: `${getTaskTopPosition(task.time!)}px`, 
                minHeight: '60px',
                width: width,
                left: left
              }}
            >
              <TaskItem task={task} onToggleComplete={onToggleComplete} onDelete={onDelete} onEdit={onEdit} />
            </div>
          ))}

          {tasks.length === 0 && (
            <div className="absolute top-8 left-0 right-0 p-4 text-center text-sm text-gray-400 pointer-events-none">
              No task for today!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DayView;