import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { Transaction, Category, TransactionType } from '../types';

interface TransactionModalProps {
  isOpen: boolean;
  editingTransaction: Transaction | null;
  categories: Category[];
  onClose: () => void;
  onSave: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function TransactionModal({
  isOpen,
  editingTransaction,
  categories,
  onClose,
  onSave,
}: TransactionModalProps) {
  const [selectedType, setSelectedType] = useState<TransactionType>(
    editingTransaction?.type || 'expense'
  );

  // Filter categories based on selected transaction type
  const filteredCategories = categories.filter(c => c.type === selectedType);

  // Update selected type when editing transaction changes
  useEffect(() => {
    if (editingTransaction) {
      setSelectedType(editingTransaction.type);
    }
  }, [editingTransaction]);

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="text-xl font-bold">
                {editingTransaction ? 'Edit Transaction' : 'New Transaction'}
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={onSave} className="p-6 space-y-4">
              {/* Type and Category */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Type</label>
                  <select
                    name="type"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as TransactionType)}
                    className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase">Category</label>
                  <select
                    name="categoryId"
                    key={selectedType} // Force re-render when type changes
                    defaultValue={editingTransaction?.categoryId || filteredCategories[0]?.id}
                    className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none"
                  >
                    {filteredCategories.length > 0 ? (
                      filteredCategories.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.icon} {c.name}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>No categories available</option>
                    )}
                  </select>
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-zinc-400">
                    $
                  </span>
                  <input
                    type="number"
                    name="amount"
                    step="0.01"
                    min="0.01"
                    required
                    defaultValue={editingTransaction?.amount}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none font-bold text-lg"
                  />
                </div>
              </div>

              {/* Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase">Date</label>
                <input
                  type="date"
                  name="date"
                  required
                  defaultValue={editingTransaction?.date || format(new Date(), 'yyyy-MM-dd')}
                  className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none"
                />
              </div>

              {/* Note */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 uppercase">Note</label>
                <textarea
                  name="note"
                  rows={3}
                  defaultValue={editingTransaction?.note}
                  placeholder="What was this for?"
                  className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none resize-none"
                />
              </div>

              {/* Actions */}
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={onClose} className="flex-1 btn-secondary">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                  disabled={filteredCategories.length === 0}
                >
                  <Check size={18} /> Save
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}