import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../types';

interface StatCardProps {
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'total';
  icon: LucideIcon;
}

export function StatCard({ title, amount, type, icon: Icon }: StatCardProps) {
  return (
    <div className="card flex items-center gap-4">
      <div className={cn(
        "p-3 rounded-2xl",
        type === 'income' && "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30",
        type === 'expense' && "bg-rose-100 text-rose-600 dark:bg-rose-900/30",
        type === 'total' && "bg-blue-100 text-blue-600 dark:bg-blue-900/30"
      )}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-zinc-500 font-medium">{title}</p>
        <p className="text-2xl font-bold tracking-tight">
          ${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );
}
