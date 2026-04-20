import React, { useState, useMemo, useEffect } from 'react';
import { startOfMonth, endOfMonth, isWithinInterval, parseISO, format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { Transaction, TransactionType, Budget } from './types';
import { useTransactions, useCategories, useBudgets, useDarkMode } from './hooks';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { TransactionList } from './components/TransactionList';
import { BudgetManager } from './components/BudgetManager';
import { Settings } from './components/Settings';
import * as cognito from './utils/cognito';
import { TransactionModal } from './components/TransactionModal';
import { AuthPage } from './components/AuthPage';

import { ReceiptUpload } from './components/ReceiptUpload';
interface User {
  name: string;
  email: string;
}

export default function App() {
  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
  const checkAuth = async () => {
    try {
      const userAttrs = await cognito.getUserAttributes();
      if (userAttrs) {
        setUser(userAttrs);
      }
    } catch {
      // Not logged in
    }
    setAuthChecked(true);
  };

  checkAuth();
}, []);

  const handleAuthSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
  cognito.signOut();
  setUser(null);
};

  // Don't render until we've checked auth
  if (!authChecked) return null;

  // Show auth page if not logged in
  if (!user) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return <AppContent user={user} onLogout={handleLogout} />;
}

// Main app content (only shown when authenticated)
function AppContent({ user, onLogout }: { user: User; onLogout: () => void }) {
  // State
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'budgets' | 'receipts' | 'settings'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  // Custom hooks
  const { transactions, saveTransaction, deleteTransaction, setTransactions } = useTransactions();
  const { categories, setCategories } = useCategories();
  const { budgets, setBudgets, addBudget, updateBudget } = useBudgets();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // Filtered transactions based on month, search, and type
  const filteredTransactions = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);

    return transactions
      .filter(t => {
        const date = parseISO(t.date);
        const matchesMonth = isWithinInterval(date, { start, end });
        const matchesSearch =
          t.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
          categories.find(c => c.id === t.categoryId)?.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || t.type === filterType;

        return matchesMonth && matchesSearch && matchesType;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, currentMonth, searchQuery, filterType, categories]);

  // Calculate statistics
  const stats = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    const expense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [filteredTransactions]);

  // Prepare chart data
  const chartData = useMemo(() => {
    const data: Record<string, { name: string; value: number; color: string }> = {};
    filteredTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const cat = categories.find(c => c.id === t.categoryId);
        if (cat) {
          if (!data[cat.id]) {
            data[cat.id] = { name: cat.name, value: 0, color: cat.color };
          }
          data[cat.id].value += t.amount;
        }
      });
    return Object.values(data);
  }, [filteredTransactions, categories]);

  // Handlers
  const handleSaveTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);

  const amount = Number(formData.get('amount'));
  if (isNaN(amount) || amount <= 0) {
    alert('Please enter a valid amount');
    return;
  }

  const transactionData = {
    amount,
    type: formData.get('type') as TransactionType,
    categoryId: formData.get('categoryId') as string,
    date: formData.get('date') as string,
    note: (formData.get('note') as string) || '',
  };

  try {
    if (editingTransaction) {
      await saveTransaction({ ...transactionData, id: editingTransaction.id }, true);
    } else {
      await saveTransaction(transactionData, false);
    }
    setIsModalOpen(false);
    setEditingTransaction(null);
  } catch {
    alert('Failed to save transaction. Please try again.');
  }
};

  const handleSaveBudget = async (categoryId: string, amount: number) => {
  const currentMonthStr = format(currentMonth, 'yyyy-MM');

  const existingBudget = budgets.find(
    b => b.categoryId === categoryId && b.period === currentMonthStr
  );

  try {
    if (existingBudget) {
      await updateBudget({ ...existingBudget, amount });
    } else {
      await addBudget({ categoryId, amount, period: currentMonthStr });
    }
  } catch {
    alert('Failed to save budget. Please try again.');
  }
};

  // const handleExport = () => {
  //   storage.exportData();
  // };

  // const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file && (await storage.importData(file))) {
  //     setTransactions(storage.getTransactions());
  //     setCategories(storage.getCategories());
  //     setBudgets(storage.getBudgets());
  //     alert('Data restored successfully!');
  //   } else {
  //     alert('Failed to import data. Please check the file format.');
  //   }
  // };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        alert('Notifications enabled!');
      }
    }
  };

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={user}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <Header
          activeTab={activeTab}
          currentMonth={currentMonth}
          onMonthChange={setCurrentMonth}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && (
              <Dashboard
                stats={stats}
                chartData={chartData}
                filteredTransactions={filteredTransactions}
                categories={categories}
              />
            )}
            {activeTab === 'transactions' && (
              <TransactionList
                filteredTransactions={filteredTransactions}
                categories={categories}
                searchQuery={searchQuery}
                filterType={filterType}
                onSearchChange={setSearchQuery}
                onFilterChange={setFilterType}
                onAddClick={handleAddTransaction}
                onEditClick={handleEditTransaction}
                onDeleteClick={deleteTransaction}
              />
            )}
            {activeTab === 'budgets' && (
              <BudgetManager
                categories={categories}
                budgets={budgets}
                filteredTransactions={filteredTransactions}
                currentMonth={currentMonth}
                onSaveBudget={handleSaveBudget}
              />
            )}
            {activeTab === 'receipts' && (
              <ReceiptUpload />
            )}
            {activeTab === 'settings' && (
              <Settings
                isDarkMode={isDarkMode}
                onToggleDarkMode={toggleDarkMode}
                onExport={() => alert('Export not available yet')}
                onImport={() => {}}
                onRequestNotification={requestNotificationPermission}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        editingTransaction={editingTransaction}
        categories={categories}
        currentMonth={currentMonth}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        onSave={handleSaveTransaction}
      />
    </div>
  );
}