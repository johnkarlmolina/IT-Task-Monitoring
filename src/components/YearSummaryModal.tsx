import React, { useMemo } from 'react';
import type { Task } from '../interfaces';
import TaskItem from './TaskItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faClipboardList } from '@fortawesome/free-solid-svg-icons';

interface YearSummaryModalProps {
  year: number;
  tasks: Task[];
  onClose: () => void;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
}

const formatDateLabel = (isoDate: string) => {
  // isoDate is expected as YYYY-MM-DD
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const YearSummaryModal: React.FC<YearSummaryModalProps> = ({ year, tasks, onClose, onToggleComplete, onDelete, onEdit }) => {
  const yearTasks = useMemo(() => {
    const yearPrefix = `${year}-`;

    return tasks
      .filter(t => typeof t.date === 'string' && t.date.startsWith(yearPrefix))
      .slice()
      .sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        const aTime = a.time ?? '99:99';
        const bTime = b.time ?? '99:99';
        if (aTime !== bTime) return aTime.localeCompare(bTime);
        return a.id - b.id;
      });
  }, [tasks, year]);

  const groupedByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const task of yearTasks) {
      const list = map.get(task.date);
      if (list) list.push(task);
      else map.set(task.date, [task]);
    }
    return Array.from(map.entries());
  }, [yearTasks]);

  const summary = useMemo(() => {
    const total = yearTasks.length;
    const completed = yearTasks.filter(t => t.completed).length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [yearTasks]);

  return (
    <div
      className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-all duration-300"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl max-h-[90vh] flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-2xl transition-all border border-gray-100 dark:border-gray-700 overflow-hidden"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 sm:p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              {year} Todo Summary
            </h2>
            <div className="flex flex-wrap gap-2 mt-2 text-xs">
              <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600">
                Total: {summary.total}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Completed: {summary.completed}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                Pending: {summary.pending}
              </span>
            </div>
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

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-grow flex flex-col gap-5 min-h-[240px] bg-white dark:bg-gray-800">
          {yearTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 py-10">
              <FontAwesomeIcon icon={faClipboardList} className="text-5xl mb-3 opacity-50" />
              <p>No tasks found for {year}.</p>
            </div>
          ) : (
            groupedByDate.map(([isoDate, dayTasks]) => (
              <section key={isoDate} className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-100">
                    {formatDateLabel(isoDate)}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {dayTasks.length} {dayTasks.length === 1 ? 'task' : 'tasks'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {dayTasks.map(task => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggleComplete={onToggleComplete}
                      onDelete={onDelete}
                      onEdit={onEdit}
                    />
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default YearSummaryModal;
