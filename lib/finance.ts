// ─────────────────────────────────────────────
//  lib/finance.ts  ·  User-specific finance store
// ─────────────────────────────────────────────

export interface Transaction {
  id: string;
  userEmail: string;
  amount: number; // always positive in storage; sign is determined by type
  type: 'Expense' | 'Income';
  category: string;
  date: string; // YYYY-MM-DD
  note: string;
}

export interface FinancialSummary {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  topCategory: string;
  topCategoryAmount: number;
  expenseBreakdown: {
    label: string;
    amount: number;
    pct: number;
    color: string;
  }[];
}

const TXN_PREFIX = 'finance_data_';

export function getTransactions(userEmail: string): Transaction[] {
  if (typeof window === 'undefined' || !userEmail) return [];
  const key = `${TXN_PREFIX}${userEmail}`;
  try {
    const data = localStorage.getItem(key);
    if (!data) {
      // Start completely empty for a new user
      return [];
    }
    return JSON.parse(data) as Transaction[];
  } catch {
    return [];
  }
}

export function saveTransactions(userEmail: string, txns: Transaction[]): void {
  if (typeof window === 'undefined' || !userEmail) return;
  const key = `${TXN_PREFIX}${userEmail}`;
  localStorage.setItem(key, JSON.stringify(txns));
}

export function addTransaction(
  userEmail: string,
  txn: Omit<Transaction, 'id' | 'userEmail'>
): Transaction {
  const txns = getTransactions(userEmail);
  const newTxn: Transaction = {
    ...txn,
    id: crypto.randomUUID(),
    userEmail,
  };
  const updated = [newTxn, ...txns];
  saveTransactions(userEmail, updated);
  
  // Dispatch a storage event so all components on the same tab listen to the update
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('finance_update'));
  }
  
  return newTxn;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Housing': '#4f46e5',
  'Food & Dining': '#39b8fd',
  'Transport': '#ffb695',
  'Shopping': '#ba1a1a',
  'Entertainment': '#86efac',
  'Utilities': '#c7c4d8',
  'Other': '#777587',
};

export function getFinancialSummary(userEmail: string): FinancialSummary {
  const txns = getTransactions(userEmail);

  let totalBalance = 0;
  let monthlyIncome = 0;
  let monthlyExpenses = 0;

  // Calculate totals
  txns.forEach((t) => {
    const amt = Number(t.amount) || 0;
    if (t.type === 'Income') {
      totalBalance += amt;
      monthlyIncome += amt;
    } else {
      totalBalance -= amt;
      monthlyExpenses += amt;
    }
  });

  // Calculate breakdown for expenses
  const categoryTotals: Record<string, number> = {};
  let totalExpense = 0;

  txns.filter(t => t.type === 'Expense').forEach((t) => {
    const amt = Number(t.amount) || 0;
    const cat = t.category || 'Other';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + amt;
    totalExpense += amt;
  });

  // Identify top category
  let topCategory = 'None';
  let topCategoryAmount = 0;
  Object.entries(categoryTotals).forEach(([cat, val]) => {
    if (val > topCategoryAmount) {
      topCategory = cat;
      topCategoryAmount = val;
    }
  });

  // Format segments
  const segments = Object.entries(categoryTotals).map(([label, amount]) => {
    const pct = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;
    const color = CATEGORY_COLORS[label] || '#777587';
    return { label, amount, pct, color };
  }).sort((a, b) => b.amount - a.amount);

  // If no expenses, make a default empty segment list
  const expenseBreakdown = segments;

  return {
    totalBalance,
    monthlyIncome,
    monthlyExpenses,
    topCategory,
    topCategoryAmount,
    expenseBreakdown,
  };
}
