import React from 'react';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Category, Budget } from '../types';
import { CategoryIcon } from './CategoryIcon';

interface BudgetModalProps {
  isOpen: boolean;
  category: Category | null;
  currentBudget: Budget | undefined;
  currentMonth: string;
  onClose: () => void;
  onSave: (categoryId: string, amount: number) => void;
}

export function BudgetModal({
  isOpen,
  category,
  currentBudget,
  currentMonth,
  onClose,
  onSave,
}: BudgetModalProps) {
  const [amount, setAmount] = React.useState(currentBudget?.amount || 0);

  React.useEffect(() => {
    if (category) {
      setAmount(currentBudget?.amount || 0);
    }
  }, [category, currentBudget]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (category && amount > 0) {
      onSave(category.id, amount);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && category && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CategoryIcon 
                  icon={category.icon} 
                  color={category.color} 
                  size="md"
                  animated={false}
                />
                <h3 className="text-xl font-bold">
                  Set Budget for {category.name}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Month Info */}
              <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl">
                <p className="text-xs font-bold text-zinc-500 uppercase mb-1">Budget Period</p>
                <p className="font-semibold">{currentMonth}</p>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">
                  Monthly Budget Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-zinc-400">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none font-bold text-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-xs text-zinc-400">
                  Set a monthly spending limit for {category.name}
                </p>
              </div>

              {/* Quick Suggestions */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-zinc-500 uppercase">Quick Suggestions</p>
                <div className="flex gap-2 flex-wrap">
                  {[50, 100, 200, 500, 1000].map(suggestion => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setAmount(suggestion)}
                      className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      ${suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={onClose} className="flex-1 btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary flex items-center justify-center gap-2">
                  <Check size={18} /> Save Budget
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}