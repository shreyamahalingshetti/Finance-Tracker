'use client';

import { useState } from 'react';
import { useFinance } from '@/hooks/useFinance';
import { saveTransactions, type Transaction } from '@/lib/finance';
import { useAuth } from '@/context/AuthContext';

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  'Food & Dining':  { bg: '#ffdbcc', text: '#7b2f00' },
  'Income':         { bg: '#c9e6ff', text: '#004c6e' },
  'Housing':        { bg: '#d3e4fe', text: '#213145' },
  'Transport':      { bg: '#e2dfff', text: '#3323cc' },
  'Shopping':       { bg: '#fce7f3', text: '#831843' },
  'Entertainment':  { bg: '#d1fae5', text: '#065f46' },
  'Health':         { bg: '#fef3c7', text: '#92400e' },
  'Utilities':      { bg: '#ede9fe', text: '#4c1d95' },
  'Other':          { bg: '#f3f4f6', text: '#374151' },
};

const CATEGORIES = ['All Categories', ...Object.keys(CATEGORY_COLORS)];

export default function TransactionsPage() {
  const { transactions, refreshData } = useFinance();
  const { user } = useAuth();
  
  const [filter, setFilter] = useState('All Categories');
  const [search, setSearch] = useState('');

  const filtered = transactions.filter((t) => {
    const matchesFilter = filter === 'All Categories' || t.category === filter;
    const matchesSearch = t.note.toLowerCase().includes(search.toLowerCase()) ||
                          t.category.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  function handleDelete(txnId: string) {
    if (!user?.email) return;
    const updated = transactions.filter((t) => t.id !== txnId);
    saveTransactions(user.email, updated);
    
    // Notify updates
    window.dispatchEvent(new Event('finance_update'));
    refreshData();
  }

  function formatDate(dateStr: string) {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div>
        <h2 className="text-headline-md" style={{ color: '#0b1c30' }}>Transactions History</h2>
        <p className="text-body-md mt-1" style={{ color: '#777587' }}>
          Search, filter, and audit your logged cash flows.
        </p>
      </div>

      <div className="rounded-2xl p-6"
        style={{ background: '#ffffff', border: '1px solid #e5eeff', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        
        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
          {/* Search */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full w-full sm:w-80"
            style={{ background: '#f8f9ff', border: '1.5px solid #e5eeff' }}>
            <span className="material-symbols-outlined" style={{ color: '#777587', fontSize: '20px' }}>search</span>
            <input
              type="text"
              placeholder="Search note or category…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-body-md w-full"
              style={{ color: '#0b1c30', border: 'none' }}
            />
          </div>

          {/* Dropdown Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-body-md font-semibold" style={{ color: '#464555' }}>Filter:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-label-md rounded-full px-4 py-2"
              style={{
                background: '#eff4ff',
                border: '1.5px solid #e5eeff',
                color: '#3525cd',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
              }}
            >
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Table List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr style={{ borderBottom: '1px solid #e5eeff' }}>
                <th className="pb-3 text-label-md tracking-wider" style={{ color: '#777587' }}>Date</th>
                <th className="pb-3 text-label-md tracking-wider" style={{ color: '#777587' }}>Category</th>
                <th className="pb-3 text-label-md tracking-wider" style={{ color: '#777587' }}>Note</th>
                <th className="pb-3 text-label-md tracking-wider text-right" style={{ color: '#777587' }}>Amount</th>
                <th className="pb-3 text-label-md tracking-wider text-center" style={{ color: '#777587', width: '80px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((txn) => {
                const colors = CATEGORY_COLORS[txn.category] ?? CATEGORY_COLORS['Other'];
                return (
                  <tr
                    key={txn.id}
                    className="border-b border-f0f4ff hover:bg-surface-container-low transition-colors"
                    style={{ borderBottom: '1px solid #f0f4ff' }}
                  >
                    <td className="py-4 text-body-md" style={{ color: '#464555' }}>{formatDate(txn.date)}</td>
                    <td className="py-4">
                      <span className="px-3 py-1 rounded-full text-label-md font-semibold"
                        style={{ background: colors.bg, color: colors.text }}>
                        {txn.category}
                      </span>
                    </td>
                    <td className="py-4 text-body-md font-medium" style={{ color: '#0b1c30' }}>{txn.note}</td>
                    <td className="py-4 text-body-md font-bold text-right"
                      style={{ color: txn.type === 'Income' ? '#16a34a' : '#ba1a1a' }}>
                      {txn.type === 'Income' ? '+' : '-'}₹{Math.abs(txn.amount).toFixed(2)}
                    </td>
                    <td className="py-4 text-center">
                      <button
                        onClick={() => handleDelete(txn.id)}
                        className="p-1 rounded-lg text-error hover:bg-error-container transition-all"
                        title="Delete Transaction"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="material-symbols-outlined" style={{ color: '#c7c4d8', fontSize: '48px' }}>receipt_long</span>
                      <p className="text-body-md font-medium" style={{ color: '#777587' }}>No transactions found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
