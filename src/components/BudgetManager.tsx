import React from 'react';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'motion/react';
import { Category, Budget, Transaction } from '../types';
import { cn } from '../types';
import { CategoryIcon } from './CategoryIcon';
import { BudgetModal } from './BudgetModal';

interface BudgetManagerProps {
  categories: Category[];
  budgets: Budget[];
  filteredTransactions: Transaction[];
  currentMonth: Date;
  onSaveBudget: (categoryId: string, amount: number) => void;
}

export function BudgetManager({ 
  categories, 
  budgets, 
  filteredTransactions, 
  currentMonth,
  onSaveBudget 
}: BudgetManagerProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  const expenseCategories = categories.filter(c => c.type === 'expense');
  const currentMonthStr = format(currentMonth, 'yyyy-MM');

  const handleSetBudget = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleSaveBudget = (categoryId: string, amount: number) => {
    onSaveBudget(categoryId, amount);
  };

  const getCurrentBudget = (categoryId: string) => {
    return budgets.find(b => b.categoryId === categoryId && b.period === currentMonthStr);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {expenseCategories.map(cat => {
          const budget = getCurrentBudget(cat.id);
          const spent = filteredTransactions
            .filter(t => t.categoryId === cat.id)
            .reduce((acc, t) => acc + t.amount, 0);
          const percentage = budget ? Math.min((spent / budget.amount) * 100, 100) : 0;

          return (
            <div key={cat.id} className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <CategoryIcon 
                    icon={cat.icon} 
                    color={cat.color} 
                    size="md"
                    animated={true}
                  />
                  <h4 className="font-bold">{cat.name}</h4>
                </div>
                <button 
                  onClick={() => handleSetBudget(cat)}
                  className="text-xs text-emerald-600 font-bold hover:underline"
                >
                  {budget ? 'Edit Budget' : 'Set Budget'}
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Spent: ${spent.toFixed(2)}</span>
                  <span className="font-bold">
                    {budget ? `$${budget.amount}` : 'No budget set'}
                  </span>
                </div>
                {budget && (
                  <>
                    <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        className={cn(
                          "h-full rounded-full",
                          percentage > 90 ? "bg-rose-500" : "bg-emerald-500"
                        )}
                      />
                    </div>
                    <p className="text-xs text-zinc-400">
                      {percentage >= 100
                        ? 'Budget exceeded!'
                        : `${(100 - percentage).toFixed(0)}% remaining`}
                    </p>
                  </>
                )}
                {!budget && (
                  <p className="text-xs text-zinc-400 italic">
                    Click "Set Budget" to create a spending limit
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Budget Modal */}
      <BudgetModal
        isOpen={isModalOpen}
        category={selectedCategory}
        currentBudget={selectedCategory ? getCurrentBudget(selectedCategory.id) : undefined}
        currentMonth={format(currentMonth, 'MMMM yyyy')}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory(null);
        }}
        onSave={handleSaveBudget}
      />
    </div>
  );
}