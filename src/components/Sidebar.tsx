import React from 'react';
import { LayoutDashboard, Filter, PieChart, Settings, LogOut } from 'lucide-react';
import { cn } from '../types';
import { BlobLogo } from './Logo';
import { motion } from 'motion/react';

interface SidebarProps {
  activeTab: 'dashboard' | 'transactions' | 'budgets' | 'settings';
  onTabChange: (tab: 'dashboard' | 'transactions' | 'budgets' | 'settings') => void;
  user: { name: string; email: string };
  onLogout: () => void;
}

const navigation = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'transactions', icon: Filter, label: 'Transactions' },
  { id: 'budgets', icon: PieChart, label: 'Budgets' },
  { id: 'settings', icon: Settings, label: 'Settings' },
] as const;

export function Sidebar({ activeTab, onTabChange, user, onLogout }: SidebarProps) {
  // Get initials from name
  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside className="w-full md:w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-10">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <BlobLogo size={40} />
        </motion.div>
        <h1 className="text-xl font-black tracking-tighter">Wally</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navigation.map(item => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all",
              activeTab === item.id
                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            )}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>

      {/* User Profile + Logout */}
      <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-3 mb-3">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-300 to-orange-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">{user.name}</p>
            <p className="text-xs text-zinc-400 truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-zinc-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 transition-all font-medium text-sm"
        >
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </aside>
  );
}