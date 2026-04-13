import { em, head } from "motion/react-client";

const API_BASE_URL = import.meta.env.PROD
  ? 'https://abc123.execute-api.us-east-1.amazonaws.com/api'
  : 'http://127.0.0.1:8000/api';

function getToken(): string | null {
    return localStorage.getItem('auth_token');
}

export function setToken(token: string): void {
    localStorage.setItem('auth_token', token);
}

export function removeToken(): void {
    localStorage.removeItem('auth_token');
}

export function has_token(): boolean {
    return !!getToken();
}


async function apiFetch(endpoint: string, options: RequestInit = {}): Promise<any> {
    const token = getToken()

    const headers: Record<string, string> = {
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers['Authorization'] = `Token ${token}`;
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



// Auth api
export interface AuthResonse {
    token: string;
    user: {
        name: string,
        email: string,
    }
}

export async function register(
    username: string,
    email: string,
    password: string, 
    name: string
) : Promise<AuthResonse> {
    const data = await apiFetch('/auth/register/', {
        method: 'POST',
        body: JSON.stringify({username, email, password, name})
    });
    setToken(data.token);
    return data;
}

export async function login(
    username: string,
    password: string
) : Promise<AuthResonse> {
    const data = await apiFetch('/auth/login/', {
        method: 'POST',
        body: JSON.stringify({username, password})
    });
    setToken(data.token);
    return data;
}

export async function logout(): Promise<void> {
    try {
        await apiFetch('/auth/login', {
            method: 'POST'
        })
    } catch {

    }
    removeToken();
}

export async function getMe(): Promise<{user: { name: string; email: string}}> {
    return apiFetch('/auth/me/')
}


// Categories api
import { Category, Transaction, Budget } from '../types'
import { da } from "date-fns/locale";

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
    return apiFetch(`/categories/${category.id}`,
        {
            method: 'PUT',
            body: JSON.stringify(category),
        }
    )
}

export async function deleteCategory(id: string): Promise<void> {
    return apiFetch(`/categories/${id}/`, {method: 'DELETE'});
}

// transaction api

interface TransactionFilters {
    month?: string;
    type?: string;
    search?: string;
}

export async function getTransactions(
    filters: TransactionFilters = {}
) : Promise<Transaction[]> {
    
    const params = new URLSearchParams();
    if (filters.month) params.append('month', filters.month);
    if (filters.type && filters.type !== 'all') params.append('type', filters.type);
    if (filters.search) params.append('serach', filters.search);

    const queryString = params.toString();
    const endpoint = `/transactions/${queryString ? `?${queryString}` : ''}`;
    const data = await apiFetch(endpoint);
    return data.map(parseTransaction);
}

export async function createTransaction(
    transaction: Omit<Transaction, 'id'>
) : Promise<Transaction> {
    const data = await apiFetch('/transactions/', {
        method: 'POST',
        body: JSON.stringify({
            ...transaction,
            amount: String(transaction.amount)
        })
    })
    return parseTransaction(data);
}

export async function updateTransaction(
    transaction: Transaction
): Promise<Transaction> {
   const data = await apiFetch(`/transactions/${transaction.id}/`, {
    method: 'PUT',
    body: JSON.stringify({
        ...transaction,
        amount: String(transaction.amount) 
    })
   }) 
   return parseTransaction(data);
}

export async function deleteTransaction(id: string): Promise<void> {
  return apiFetch(`/transactions/${id}/`, { method: 'DELETE' });
}

// budgets api

export async function getBudgets(period?: string): Promise<Budget[]> {
  const endpoint = period ? `/budgets/?period=${period}` : '/budgets/';
  const data = await apiFetch(endpoint)
  return data.map(parseBudget) 
}

export async function createBudget(
    budget: Omit<Budget, 'id'>
): Promise<Budget> {
    const data = await apiFetch('/budgets/', {
        method: 'POST',
        body: JSON.stringify({
            ...budget,
            amount: String(budget.amount)
        })
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



function parseTransaction(data: any): Transaction {
  return {
    ...data,
    amount: Number(data.amount),
  };
}

function parseBudget(data: any): Budget {
  return {
    ...data,
    amount: Number(data.amount),
  };
}