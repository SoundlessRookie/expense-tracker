import { useState, useEffect } from 'react';
import { Transaction, Category, Budget } from '../types';
import { storage } from '../utils/storage';

/**
 * Hook for managing transactions
 */
export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    setTransactions(storage.getTransactions());
  }, []);

  const addTransaction = (transaction: Transaction) => {
    const updated = [...transactions, transaction];
    setTransactions(updated);
    storage.saveTransactions(updated);
  };

  const updateTransaction = (transaction: Transaction) => {
    const updated = transactions.map(t => 
      t.id === transaction.id ? transaction : t
    );
    setTransactions(updated);
    storage.saveTransactions(updated);
  };

  const deleteTransaction = (id: string) => {
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    storage.saveTransactions(updated);
  };

  const saveTransaction = (transaction: Transaction, isEditing: boolean) => {
    if (isEditing) {
      updateTransaction(transaction);
    } else {
      addTransaction(transaction);
    }
  };

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    saveTransaction,
    setTransactions,
  };
}

/**
 * Hook for managing categories
 */
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    setCategories(storage.getCategories());
  }, []);

  const saveCategories = (newCategories: Category[]) => {
    setCategories(newCategories);
    storage.saveCategories(newCategories);
  };

  return {
    categories,
    setCategories: saveCategories,
  };
}

/**
 * Hook for managing budgets
 */
export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);

  useEffect(() => {
    setBudgets(storage.getBudgets());
  }, []);

  const saveBudgets = (newBudgets: Budget[]) => {
    setBudgets(newBudgets);
    storage.saveBudgets(newBudgets);
  };

  const addBudget = (budget: Budget) => {
    const updated = [...budgets, budget];
    saveBudgets(updated);
  };

  const updateBudget = (budget: Budget) => {
    const updated = budgets.map(b => 
      b.categoryId === budget.categoryId && b.period === budget.period ? budget : b
    );
    saveBudgets(updated);
  };

  const deleteBudget = (categoryId: string, period: string) => {
    const updated = budgets.filter(
      b => !(b.categoryId === categoryId && b.period === period)
    );
    saveBudgets(updated);
  };

  return {
    budgets,
    setBudgets: saveBudgets,
    addBudget,
    updateBudget,
    deleteBudget,
  };
}

/**
 * Hook for managing dark mode
 */
export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('sw_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDarkMode(shouldBeDark);
    
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      
      // update DOM
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('sw_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('sw_theme', 'light');
      }
      
      return newMode;
    });
  };

  return {
    isDarkMode,
    toggleDarkMode,
  };
}
