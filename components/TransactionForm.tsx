'use client';

import { useState, FormEvent } from 'react';
import { useFinance } from '@/hooks/useFinance';

const CATEGORIES = ['Food & Dining', 'Transport', 'Housing', 'Entertainment', 'Shopping', 'Health', 'Utilities', 'Other'];

export default function TransactionForm() {
  const { addTransaction } = useFinance();

  const [amount, setAmount]     = useState('');
  const [type, setType]         = useState('Expense');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate]         = useState(() => {
    // Default to today's date in YYYY-MM-DD format
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [note, setNote]         = useState('');
  const [saved, setSaved]       = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    addTransaction({
      amount: numAmount,
      type: type as 'Expense' | 'Income',
      category: type === 'Income' ? 'Income' : category,
      date: date,
      note: note.trim() || `${type} Transaction`,
    });

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setAmount('');
      setNote('');
      // Reset date to today
      const today = new Date();
      setDate(today.toISOString().split('T')[0]);
    }, 1800);
  }

  const inputStyle = {
    background: '#f8f9ff',
    border: '1.5px solid #e5eeff',
    color: '#0b1c30',
    borderRadius: '10px',
    padding: '10px 14px',
    fontSize: '14px',
    width: '100%',
    transition: 'border-color 0.2s',
    fontFamily: 'Inter, sans-serif',
  };

  return (
    <div className="rounded-2xl p-6 h-full"
      style={{ background: '#ffffff', border: '1px solid #e5eeff', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>

      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: '#e2dfff' }}>
          <span className="material-symbols-outlined" style={{ color: '#3525cd', fontSize: '18px' }}>add_circle</span>
        </div>
        <h3 className="text-headline-sm" style={{ color: '#0b1c30' }}>New Transaction</h3>
      </div>

      {/* Success */}
      {saved && (
        <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl animate-fade-in"
          style={{ background: '#d1fae5', border: '1px solid #6ee7b7' }}>
          <span className="material-symbols-outlined" style={{ color: '#065f46', fontSize: '18px' }}>check_circle</span>
          <p className="text-body-md font-medium" style={{ color: '#065f46' }}>Transaction logged!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount */}
        <div>
          <label className="block text-label-md mb-1.5 tracking-wider" style={{ color: '#777587' }}>AMOUNT (₹)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-body-lg font-bold" style={{ color: '#3525cd' }}>₹</span>
            <input
              id="txn-amount"
              type="number"
              step="0.01"
              min="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              style={{ ...inputStyle, paddingLeft: '28px' }}
              onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
              onBlur={(e) => e.target.style.borderColor = '#e5eeff'}
            />
          </div>
        </div>

        {/* Type + Category */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-label-md mb-1.5 tracking-wider" style={{ color: '#777587' }}>TYPE</label>
            <select
              id="txn-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
              onBlur={(e) => e.target.style.borderColor = '#e5eeff'}
            >
              <option>Expense</option>
              <option>Income</option>
            </select>
          </div>
          <div>
            <label className="block text-label-md mb-1.5 tracking-wider" style={{ color: '#777587' }}>CATEGORY</label>
            <select
              id="txn-category"
              disabled={type === 'Income'}
              value={type === 'Income' ? 'Income' : category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                ...inputStyle,
                opacity: type === 'Income' ? 0.6 : 1,
                cursor: type === 'Income' ? 'not-allowed' : 'default',
              }}
              onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
              onBlur={(e) => e.target.style.borderColor = '#e5eeff'}
            >
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-label-md mb-1.5 tracking-wider" style={{ color: '#777587' }}>DATE</label>
          <input
            id="txn-date"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
            onBlur={(e) => e.target.style.borderColor = '#e5eeff'}
          />
        </div>

        {/* Note */}
        <div>
          <label className="block text-label-md mb-1.5 tracking-wider" style={{ color: '#777587' }}>NOTE</label>
          <textarea
            id="txn-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What was this for?"
            rows={3}
            style={{ ...inputStyle, resize: 'none' }}
            onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
            onBlur={(e) => e.target.style.borderColor = '#e5eeff'}
          />
        </div>

        {/* Submit */}
        <button
          id="txn-submit"
          type="submit"
          className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-200"
          style={{
            background: 'linear-gradient(135deg, #3525cd, #4f46e5)',
            color: '#ffffff',
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(53,37,205,0.25)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(53,37,205,0.35)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(53,37,205,0.25)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>save</span>
          Log Transaction
        </button>
      </form>
    </div>
  );
}
