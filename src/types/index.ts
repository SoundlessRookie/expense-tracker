import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function for merging Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  icon: string;  // Emoji icon
  color: string;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  date: string;
  note: string;
}

export interface Budget {
  categoryId: string;
  amount: number;
  period: string; // e.g., '2024-03'
}

export const DEFAULT_CATEGORIES: Category[] = [
  // EXPENSES - Spending Categories
  
  // Food & Beverages
  { 
    id: 'food', 
    name: 'Food & Dining', 
    icon: '🍜',  
    color: '#FB923C', 
    type: 'expense' 
  },
  
  { 
    id: 'groceries', 
    name: 'Groceries', 
    icon: '🛒',  
    color: '#10B981',  
    type: 'expense' 
  },
  
  // Transportation
  { 
    id: 'transport', 
    name: 'Transportation', 
    icon: '🚗',  
    color: '#3B82F6',  
    type: 'expense' 
  },
  
  // Shopping & Lifestyle
  { 
    id: 'shopping', 
    name: 'Shopping', 
    icon: '🛍️',  
    color: '#EC4899',  
    type: 'expense' 
  },
  { 
    id: 'entertainment', 
    name: 'Entertainment', 
    icon: '🎮',  
    color: '#8B5CF6',  
    type: 'expense' 
  },
  
  // Health & Wellness
  { 
    id: 'health', 
    name: 'Health & Fitness', 
    icon: '💪',  
    color: '#10B981',  
    type: 'expense' 
  },
  
  // Home & Living
  { 
    id: 'home', 
    name: 'Home & Garden', 
    icon: '🏡',  
    color: '#F59E0B',  
    type: 'expense' 
  },
  { 
    id: 'bills', 
    name: 'Bills & Utilities', 
    icon: '💡',  
    color: '#EAB308',  
    type: 'expense' 
  },
  
  // Personal & Others
  { 
    id: 'pets', 
    name: 'Pets', 
    icon: '🐾',  
    color: '#F97316',  
    type: 'expense' 
  },
  { 
    id: 'education', 
    name: 'Education', 
    icon: '📚',  
    color: '#6366F1',  
    type: 'expense' 
  },
  { 
    id: 'travel', 
    name: 'Travel & Vacation', 
    icon: '✈️', 
    color: '#06B6D4',  
    type: 'expense' 
  },
  
  // INCOME - Earning Categories
  
  { 
    id: 'salary', 
    name: 'Salary', 
    icon: '💰',  
    color: '#10B981',  
    type: 'income' 
  },
  { 
    id: 'investment', 
    name: 'Investment', 
    icon: '📈',  
    color: '#3B82F6',  
    type: 'income' 
  },
  { 
    id: 'gift_income', 
    name: 'Gifts Received', 
    icon: '🎉', 
    color: '#EC4899', 
    type: 'income' 
  },
  { 
    id: 'bonus', 
    name: 'Bonus & Rewards', 
    icon: '🎯',  
    color: '#F59E0B',  
    type: 'income' 
  },
  { 
    id: 'other_income', 
    name: 'Other Income', 
    icon: '✨',  
    color: '#A855F7',  
    type: 'income' 
  },
];

/**
 * Border radius for warm, friendly feel
 */
export const borderRadius = {
  sm: '0.5rem',    // 8px
  md: '0.75rem',   // 12px
  lg: '1rem',      // 16px
  xl: '1.25rem',   // 20px
  '2xl': '1.5rem', // 24px
  full: '9999px',
};

/**
 * Spacing scale
 */
export const spacing = {
  xs: '0.5rem',   // 8px
  sm: '0.75rem',  // 12px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
  '3xl': '4rem',  // 64px
};