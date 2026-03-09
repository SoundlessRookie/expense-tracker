import React from 'react';
import { Search, Filter, Plus, Edit2, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Transaction, Category, TransactionType } from '../types';
import { cn } from '../types';
import { CategoryIcon } from './CategoryIcon';

interface TransactionListProps {
  filteredTransactions: Transaction[];
  categories: Category[];
  searchQuery: string;
  filterType: 'all' | 'income' | 'expense';
  onSearchChange: (query: string) => void;
  onFilterChange: (type: 'all' | 'income' | 'expense') => void;
  onAddClick: () => void;
  onEditClick: (transaction: Transaction) => void;
  onDeleteClick: (id: string) => void;
}

export function TransactionList({
  filteredTransactions,
  categories,
  searchQuery,
  filterType,
  onSearchChange,
  onFilterChange,
  onAddClick,
  onEditClick,
  onDeleteClick,
}: TransactionListProps) {
  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input
            type="text"
            placeholder="Search transactions..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select
            className="flex-1 md:flex-none px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none"
            value={filterType}
            onChange={(e) => onFilterChange(e.target.value as 'all' | 'income' | 'expense')}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <button onClick={onAddClick} className="btn-primary flex items-center gap-2">
            <Plus size={18} /> Add
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase">Note</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {filteredTransactions.map(t => {
                const cat = categories.find(c => c.id === t.categoryId);
                return (
                  <tr key={t.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {format(parseISO(t.date), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <CategoryIcon 
                          icon={cat?.icon || '📦'} 
                          color={cat?.color || '#A8A29E'} 
                          size="sm"
                          animated={false}
                        />
                        <span className="text-sm font-medium">{cat?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500 max-w-xs truncate">{t.note}</td>
                    <td className={cn(
                      "px-6 py-4 whitespace-nowrap text-sm font-bold",
                      t.type === 'income' ? "text-emerald-600" : "text-rose-600"
                    )}>
                      {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onEditClick(t)}
                          className="p-2 text-zinc-400 hover:text-blue-500 transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => onDeleteClick(t.id)}
                          className="p-2 text-zinc-400 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}