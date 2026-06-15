'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  getTransactions,
  getFinancialSummary,
  addTransaction as apiAddTransaction,
  type Transaction,
  type FinancialSummary,
} from '@/lib/finance';

export function useFinance() {
  const { user } = useAuth();
  const userEmail = user?.email || '';

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<FinancialSummary>({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    topCategory: 'None',
    topCategoryAmount: 0,
    expenseBreakdown: [],
  });

  const refreshData = useCallback(() => {
    if (!userEmail) return;
    setTransactions(getTransactions(userEmail));
    setSummary(getFinancialSummary(userEmail));
  }, [userEmail]);

  useEffect(() => {
    refreshData();

    // Listen to changes initiated from forms on the same page
    window.addEventListener('finance_update', refreshData);
    return () => {
      window.removeEventListener('finance_update', refreshData);
    };
  }, [userEmail, refreshData]);

  const addTransaction = useCallback((txn: Omit<Transaction, 'id' | 'userEmail'>) => {
    if (!userEmail) return;
    apiAddTransaction(userEmail, txn);
  }, [userEmail]);

  return {
    transactions,
    summary,
    addTransaction,
    refreshData,
  };
}
