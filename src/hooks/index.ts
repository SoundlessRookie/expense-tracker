import { useState, useEffect, useCallback } from 'react';
import { Transaction, Category, Budget } from '../types';
import * as api from '../utils/api';

/**
 * Hook for managing transactions.
 *
 * Key difference from the localStorage version:
 * - Data is fetched from the API, not read from localStorage
 * - CRUD operations call the API, which updates the database
 * - Filters (month, type, search) are sent to the server
 *   so the database does the filtering, not the frontend
 */
export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch transactions from the API
  // Call this whenever filters change or after a mutation
  const fetchTransactions = useCallback(
    async (filters: { month?: string; type?: string; search?: string } = {}) => {
      try {
        setLoading(true);
        const data = await api.getTransactions(filters);
        setTransactions(data);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Load transactions on mount
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const created = await api.createTransaction(transaction);
      // Add the new transaction to local state so the UI updates immediately
      setTransactions(prev => [created, ...prev]);
      return created;
    } catch (error) {
      console.error('Failed to create transaction:', error);
      throw error;
    }
  };

  const updateTransaction = async (transaction: Transaction) => {
    try {
      const updated = await api.updateTransaction(transaction);
      setTransactions(prev =>
        prev.map(t => (t.id === updated.id ? updated : t))
      );
      return updated;
    } catch (error) {
      console.error('Failed to update transaction:', error);
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
  try {
    await api.deleteTransaction(id);
    console.log('Before filter:', transactions.length);
    setTransactions(prev => {
      const filtered = prev.filter(t => t.id !== id);
      console.log('After filter:', filtered.length);
      return filtered;
    });
  } catch (error) {
    console.error('Failed to delete transaction:', error);
    throw error;
  }
};

  const saveTransaction = async (
    transaction: Transaction | Omit<Transaction, 'id'>,
    isEditing: boolean
  ) => {
    if (isEditing) {
      return updateTransaction(transaction as Transaction);
    } else {
      return addTransaction(transaction);
    }
  };

  return {
    transactions,
    loading,
    fetchTransactions,
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
/**
 * Hook for managing categories.
 */
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    setCategories,
  };
}

/**
 * Hook for managing budgets
 */
/**
 * Hook for managing budgets.
 */
export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBudgets = useCallback(async (period?: string) => {
    try {
      setLoading(true);
      const data = await api.getBudgets(period);
      setBudgets(data);
    } catch (error) {
      console.error('Failed to fetch budgets:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const addBudget = async (budget: Omit<Budget, 'id'>) => {
    try {
      const created = await api.createBudget(budget);
      setBudgets(prev => [...prev, created]);
      return created;
    } catch (error) {
      console.error('Failed to create budget:', error);
      throw error;
    }
  };

  const updateBudget = async (budget: Budget) => {
    try {
      const updated = await api.updateBudget(budget);
      setBudgets(prev =>
        prev.map(b =>
          b.categoryId === updated.categoryId && b.period === updated.period
            ? updated
            : b
        )
      );
      return updated;
    } catch (error) {
      console.error('Failed to update budget:', error);
      throw error;
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      await api.deleteBudget(id);
      setBudgets(prev => prev.filter(b => (b as any).id !== id));
    } catch (error) {
      console.error('Failed to delete budget:', error);
      throw error;
    }
  };

  return {
    budgets,
    loading,
    fetchBudgets,
    setBudgets,
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
