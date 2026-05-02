import { getIdToken } from './cognito';
import { Category, Transaction, Budget } from '../types';

const API_BASE_URL = import.meta.env.PROD
  ? 'https://mama4q8eoe.execute-api.us-east-1.amazonaws.com/api'
  : 'http://127.0.0.1:8000/api';

async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<any> {
  const token = await getIdToken();

  const headers: Record<string, string> = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (options.body) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || data.error || 'Something went wrong');
  }

  return data;
}

export async function getCategories(): Promise<Category[]> {
  return apiFetch('/categories/');
}

export async function createCategory(
  category: Omit<Category, 'id'>
): Promise<Category> {
  return apiFetch('/categories/', {
    method: 'POST',
    body: JSON.stringify(category),
  });
}

export async function updateCategory(category: Category): Promise<Category> {
  return apiFetch(`/categories/${category.id}/`, {
    method: 'PUT',
    body: JSON.stringify(category),
  });
}

export async function deleteCategory(id: string): Promise<void> {
  return apiFetch(`/categories/${id}/`, { method: 'DELETE' });
}

interface TransactionFilters {
  month?: string;
  type?: string;
  search?: string;
}

export async function getTransactions(
  filters: TransactionFilters = {}
): Promise<Transaction[]> {
  const params = new URLSearchParams();
  if (filters.month) params.append('month', filters.month);
  if (filters.type && filters.type !== 'all') params.append('type', filters.type);
  if (filters.search) params.append('search', filters.search);

  const queryString = params.toString();
  const endpoint = `/transactions/${queryString ? `?${queryString}` : ''}`;
  const data = await apiFetch(endpoint);
  return data.map(parseTransaction);
}

export async function createTransaction(
  transaction: Omit<Transaction, 'id'>
): Promise<Transaction> {
  const data = await apiFetch('/transactions/', {
    method: 'POST',
    body: JSON.stringify({
      ...transaction,
      amount: String(transaction.amount),
    }),
  });
  return parseTransaction(data);
}

export async function updateTransaction(
  transaction: Transaction
): Promise<Transaction> {
  const data = await apiFetch(`/transactions/${transaction.id}/`, {
    method: 'PUT',
    body: JSON.stringify({
      ...transaction,
      amount: String(transaction.amount),
    }),
  });
  return parseTransaction(data);
}

export async function deleteTransaction(id: string): Promise<void> {
  return apiFetch(`/transactions/${id}/`, { method: 'DELETE' });
}


export async function getBudgets(period?: string): Promise<Budget[]> {
  const endpoint = period ? `/budgets/?period=${period}` : '/budgets/';
  const data = await apiFetch(endpoint);
  return data.map(parseBudget);
}

export async function createBudget(
  budget: Omit<Budget, 'id'>
): Promise<Budget> {
  const data = await apiFetch('/budgets/', {
    method: 'POST',
    body: JSON.stringify({
      ...budget,
      amount: String(budget.amount),
    }),
  });
  return parseBudget(data);
}

export async function updateBudget(budget: Budget): Promise<Budget> {
  const data = await apiFetch(`/budgets/${(budget as any).id}/`, {
    method: 'PUT',
    body: JSON.stringify({
      ...budget,
      amount: String(budget.amount),
    }),
  });
  return parseBudget(data);
}

export async function deleteBudget(id: string): Promise<void> {
  return apiFetch(`/budgets/${id}/`, { method: 'DELETE' });
}


function parseTransaction(data: any): Transaction {https://main.d2wjmdcvmn0xbr.amplifyapp.com
  return { ...data, amount: Number(data.amount) };
}

function parseBudget(data: any): Budget {
  return { ...data, amount: Number(data.amount) };
}

export async function exportData(): Promise<string> {
  const data = await apiFetch('/export/', { method: 'POST' });
  return data.download_url;
}

/**
 * Get a pre-signed URL for uploading a receipt to S3.
 */
export async function getReceiptUploadUrl(
  filename: string
): Promise<{ upload_url: string; key: string }> {
  return apiFetch('/receipts/upload-url/', {
    method: 'POST',
    body: JSON.stringify({ filename }),
  });
}

/**
 * Upload a receipt image. Gets a pre-signed URL then uploads directly to S3.
 * The S3 upload triggers the Lambda receipt processor automatically.
 */
export async function uploadReceipt(file: File): Promise<void> {
  // Step 1: Get pre-signed URL from Django
  const { upload_url } = await getReceiptUploadUrl(file.name);

  // Step 2: Upload directly to S3
  const response = await fetch(upload_url, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': 'image/jpeg',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to upload receipt');
  }
}