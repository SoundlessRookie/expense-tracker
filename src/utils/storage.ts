import { Category, Transaction, Budget, DEFAULT_CATEGORIES } from '../types';

const STORAGE_KEYS = {
  TRANSACTIONS: 'sw_transactions',
  CATEGORIES: 'sw_categories',
  BUDGETS: 'sw_budgets',
  SETTINGS: 'sw_settings',
} as const;

/**
 * Safe JSON parse with error handling
 */
function safeJsonParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return fallback;
  }
}

/**
 * Local storage wrapper for application data
 */
export const storage = {
  /**
   * Get all transactions from storage
   */
  getTransactions: (): Transaction[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return safeJsonParse(data, []);
  },

  /**
   * Save transactions to storage
   */
  saveTransactions: (transactions: Transaction[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (error) {
      console.error('Failed to save transactions:', error);
    }
  },
  
  /**
   * Get all categories from storage
   */
  getCategories: (): Category[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return safeJsonParse(data, DEFAULT_CATEGORIES);
  },

  /**
   * Save categories to storage
   */
  saveCategories: (categories: Category[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (error) {
      console.error('Failed to save categories:', error);
    }
  },

  /**
   * Get all budgets from storage
   */
  getBudgets: (): Budget[] => {
    const data = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    return safeJsonParse(data, []);
  },

  /**
   * Save budgets to storage
   */
  saveBudgets: (budgets: Budget[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
    } catch (error) {
      console.error('Failed to save budgets:', error);
    }
  },

  /**
   * Export all data as JSON file
   */
  exportData: (): void => {
    try {
      const data = {
        transactions: storage.getTransactions(),
        categories: storage.getCategories(),
        budgets: storage.getBudgets(),
        settings: localStorage.getItem(STORAGE_KEYS.SETTINGS),
        version: '1.0.0',
        timestamp: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `spendwise_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data:', error);
      alert('Failed to export data. Please try again.');
    }
  },

  /**
   * Import data from JSON file
   */
  importData: async (file: File): Promise<boolean> => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (data.transactions) storage.saveTransactions(data.transactions);
      if (data.categories) storage.saveCategories(data.categories);
      if (data.budgets) storage.saveBudgets(data.budgets);
      
      return true;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  }
};
