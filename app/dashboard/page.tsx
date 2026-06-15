'use client';

import { useAuth } from '@/context/AuthContext';
import SummaryCards from '@/components/SummaryCards';
import TransactionForm from '@/components/TransactionForm';
import TransactionTable from '@/components/TransactionTable';
import ExpenseBreakdown from '@/components/ExpenseBreakdown';
import InsightsPanel from '@/components/InsightsPanel';

export default function DashboardPage() {
  const { user } = useAuth();

  // Current date greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6 animate-fade-in pb-10">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-headline-md" style={{ color: '#0b1c30' }}>
            {greeting}, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className="text-body-md mt-1" style={{ color: '#777587' }}>
            Here&apos;s a summary of your finances today.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Date range chip */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full text-label-md font-semibold tracking-wider transition-all duration-200"
            style={{
              background: '#e2dfff',
              color: '#3525cd',
              border: '1.5px solid #c3c0ff',
            }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>calendar_month</span>
            JUNE 2026
          </div>

          {/* Quick add button (mobile) */}
          <button
            className="md:hidden w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-200"
            style={{ background: 'linear-gradient(135deg, #3525cd, #4f46e5)', color: '#ffffff' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>add</span>
          </button>
        </div>
      </div>

      {/* ── Row 1: Summary Cards ── */}
      <SummaryCards />

      {/* ── Row 2: Transaction Form + Table ── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-4">
          <TransactionForm />
        </div>
        <div className="lg:col-span-8">
          <TransactionTable />
        </div>
      </section>

      {/* ── Row 3: Expense Breakdown + Insights ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <ExpenseBreakdown />
        <InsightsPanel />
      </section>
    </div>
  );
}
