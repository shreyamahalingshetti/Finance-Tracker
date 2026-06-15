'use client';

import { useState } from 'react';
import { useFinance } from '@/hooks/useFinance';

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

export default function TransactionTable() {
  const { transactions } = useFinance();
  const [filter, setFilter] = useState('All Categories');

  const filtered = filter === 'All Categories'
    ? transactions
    : transactions.filter((t) => t.category === filter);

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
    <div className="rounded-2xl p-6 h-full"
      style={{ background: '#ffffff', border: '1px solid #e5eeff', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#e2dfff' }}>
            <span className="material-symbols-outlined" style={{ color: '#3525cd', fontSize: '18px' }}>list_alt</span>
          </div>
          <h3 className="text-headline-sm" style={{ color: '#0b1c30' }}>Recent Transactions</h3>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined" style={{ color: '#777587', fontSize: '18px' }}>filter_list</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-label-md rounded-full px-4 py-1.5 transition-all duration-200"
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr style={{ borderBottom: '1px solid #e5eeff' }}>
              {['Date', 'Category', 'Note', 'Amount'].map((h, i) => (
                <th key={h} className="pb-3 text-label-md tracking-wider"
                  style={{ color: '#777587', textAlign: i === 3 ? 'right' : 'left' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((txn, i) => {
              const colors = CATEGORY_COLORS[txn.category] ?? CATEGORY_COLORS['Other'];
              return (
                <tr
                  key={txn.id}
                  className="transition-colors duration-150 animate-fade-in"
                  style={{
                    borderBottom: i < filtered.length - 1 ? '1px solid #f0f4ff' : 'none',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#f8f9ff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <td className="py-3.5 text-body-md" style={{ color: '#464555' }}>{formatDate(txn.date)}</td>
                  <td className="py-3.5">
                    <span className="px-3 py-1 rounded-full text-label-md font-semibold"
                      style={{ background: colors.bg, color: colors.text }}>
                      {txn.category}
                    </span>
                  </td>
                  <td className="py-3.5 text-body-md" style={{ color: '#777587' }}>{txn.note}</td>
                  <td className="py-3.5 text-body-md font-bold text-right"
                    style={{ color: txn.type === 'Income' ? '#16a34a' : '#ba1a1a' }}>
                    {txn.type === 'Income' ? '+' : '-'}₹{Math.abs(txn.amount).toFixed(2)}
                  </td>
                </tr>
              );
            })}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2 animate-fade-in">
                    <span className="material-symbols-outlined" style={{ color: '#c7c4d8', fontSize: '40px' }}>receipt_long</span>
                    <p className="text-body-md font-medium" style={{ color: '#777587' }}>No transactions added yet.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {transactions.length > 0 && (
        <div className="mt-4 pt-4 flex justify-end" style={{ borderTop: '1px solid #f0f4ff' }}>
          <button className="text-label-md font-bold flex items-center gap-1 transition-colors duration-150 tracking-wider"
            style={{ color: '#3525cd' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#4f46e5'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#3525cd'; }}>
            VIEW ALL TRANSACTIONS
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chevron_right</span>
          </button>
        </div>
      )}
    </div>
  );
}
