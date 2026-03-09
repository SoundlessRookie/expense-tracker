import React from 'react';
import { LayoutDashboard, Filter, PieChart, Settings } from 'lucide-react';
import { cn } from '../types';
import { BlobLogo } from './Logo';
import { motion } from 'motion/react';

interface SidebarProps {
  activeTab: 'dashboard' | 'transactions' | 'budgets' | 'settings';
  onTabChange: (tab: 'dashboard' | 'transactions' | 'budgets' | 'settings') => void;
}

const navigation = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'transactions', icon: Filter, label: 'Transactions' },
  { id: 'budgets', icon: PieChart, label: 'Budgets' },
  { id: 'settings', icon: Settings, label: 'Settings' },
] as const;

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="w-full md:w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-10">
        
        {/* happy logo with motion animation */}
        { 
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <BlobLogo size={40} />
        </motion.div>
        }
        
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

    </aside>
  );
}