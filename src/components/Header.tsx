import React from 'react';
import { ChevronLeft, ChevronRight, Bell } from 'lucide-react';
import { format, subMonths, addMonths } from 'date-fns';

interface HeaderProps {
  activeTab: string;
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
}

export function Header({ activeTab, currentMonth, onMonthChange }: HeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight capitalize">{activeTab}</h2>
        <p className="text-zinc-500">Manage your finances with ease.</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Month Navigator */}
        <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => onMonthChange(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="px-4 font-bold text-sm min-w-[120px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button
            onClick={() => onMonthChange(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Notification Bell */}
        <button className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-zinc-900" />
        </button>
      </div>
    </header>
  );
}
