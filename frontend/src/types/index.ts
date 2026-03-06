// User Types
export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

// Expense Types
export interface Expense {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  category: string;
  merchant: string;
  date: string;
  description?: string;
  receiptUrl?: string;
  items?: ExpenseItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseItem {
  name: string;
  quantity: number;
  price: number;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

// Receipt Types
export interface Receipt {
  id: string;
  expenseId?: string;
  userId: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  processedAt?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  extractedData?: {
    merchant?: string;
    amount?: number;
    date?: string;
    items?: ExpenseItem[];
  };
}

// Report Types
export interface MonthlyReport {
  month: string;
  year: number;
  totalExpenses: number;
  categoryBreakdown: CategoryExpense[];
  topMerchants: MerchantExpense[];
  dailyTrends: DailyTrend[];
}

export interface CategoryExpense {
  category: string;
  amount: number;
  percentage: number;
  count: number;
}

export interface MerchantExpense {
  merchant: string;
  amount: number;
  count: number;
}

export interface DailyTrend {
  date: string;
  amount: number;
}

// Form Types
export interface ExpenseFormData {
  amount: number;
  category: string;
  merchant: string;
  date: string;
  description?: string;
  receipt?: File;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Filter Types
export interface ExpenseFilters {
  startDate?: string;
  endDate?: string;
  category?: string;
  merchant?: string;
  minAmount?: number;
  maxAmount?: number;
  searchQuery?: string;
}

// Dashboard Types
export interface DashboardStats {
  totalExpenses: number;
  monthlyExpenses: number;
  averageTransaction: number;
  expenseCount: number;
  topCategory: string;
  comparison: {
    lastMonth: number;
    percentageChange: number;
  };
}
