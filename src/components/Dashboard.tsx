import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, Wallet, Plus } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { motion } from 'motion/react';
import { Transaction, Category } from '../types';
import { cn } from '../types';
import { StatCard } from './StatCard';
import { SmartBlobMascot } from './Logo';
import { CategoryIcon } from './CategoryIcon';

interface DashboardProps {
  stats: {
    income: number;
    expense: number;
    balance: number;
  };
  chartData: Array<{ name: string; value: number; color: string }>;
  filteredTransactions: Transaction[];
  categories: Category[];
}

const MAX_RECENT_TRANSACTIONS = 5;

export function Dashboard({ stats, chartData, filteredTransactions, categories }: DashboardProps) {
  return (
    <div className="space-y-6">
      {/* Animated Blob Mascot with Dynamic Expression */}
      <motion.div 
        className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-zinc-800 dark:to-zinc-900 rounded-3xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SmartBlobMascot 
          size={120} 
          balance={stats.balance}
          animate={true}
        />
        <motion.p 
          className="mt-4 text-lg font-bold text-zinc-700 dark:text-zinc-300"
          key={stats.balance >= 0 ? 'happy' : 'sad'}  // this will trigger re-animation when balance changes
          animate={{ opacity: 1 }}
        >
          {stats.balance >= 0 
            ? "Your finances are looking good! 😊" 
            : "Oh no, your balance is low! 😢"}
        </motion.p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Balance" amount={stats.balance} type="total" icon={Wallet} />
        <StatCard title="Monthly Income" amount={stats.income} type="income" icon={ArrowUpCircle} />
        <StatCard title="Monthly Expenses" amount={stats.expense} type="expense" icon={ArrowDownCircle} />
      </div>

      {/* Charts and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Distribution Chart */}
        <div className="card">
          <h3 className="text-lg font-bold mb-6">Expense Distribution</h3>
          <div className="h-[300px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                    }}
                    formatter={(value: number) => `$${value.toFixed(2)}`}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                <SmartBlobMascot size={80} balance={0} animate={false} />
                <p className="mt-4">No expense data to display</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <h3 className="text-lg font-bold mb-6">Recent Transactions</h3>
          <div className="space-y-4">
            {filteredTransactions.slice(0, MAX_RECENT_TRANSACTIONS).map(t => {
              const cat = categories.find(c => c.id === t.categoryId);
              return (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <CategoryIcon 
                      icon={cat?.icon || '📦'} 
                      color={cat?.color || '#A8A29E'} 
                      size="sm"
                      animated={true}
                    />
                    <div>
                      <p className="font-semibold">{cat?.name || 'Other'}</p>
                      <p className="text-xs text-zinc-500">
                        {format(parseISO(t.date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <p className={cn(
                    "font-bold",
                    t.type === 'income' ? "text-emerald-600" : "text-rose-600"
                  )}>
                    {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                  </p>
                </div>
              );
            })}
            {filteredTransactions.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-zinc-500">
                <SmartBlobMascot size={80} balance={-1} animate={false} />
                <p className="mt-4">No transactions this month.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}