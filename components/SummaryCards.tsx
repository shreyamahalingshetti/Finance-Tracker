'use client';

import { useFinance } from '@/hooks/useFinance';

export default function SummaryCards() {
  const { transactions, summary } = useFinance();

  const formattedBalance = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(summary.totalBalance);

  const formattedIncome = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(summary.monthlyIncome);

  const formattedExpenses = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(summary.monthlyExpenses);

  const formattedTopCategory = summary.topCategory === 'None' || !summary.topCategory
    ? 'No Expenses'
    : summary.topCategory;

  const topCategoryVal = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(summary.topCategoryAmount);

  // Dynamic calculations for footers
  
  // 1. Total Balance Footer
  let balanceFooter = (
    <div className="flex items-center gap-1">
      <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#777587' }}>info</span>
      <span className="text-label-md" style={{ color: '#777587' }}>No transactions logged</span>
    </div>
  );
  if (transactions.length > 0) {
    if (summary.totalBalance > 0) {
      balanceFooter = (
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#16a34a' }}>trending_up</span>
          <span className="text-label-md" style={{ color: '#16a34a' }}>Net positive savings</span>
        </div>
      );
    } else if (summary.totalBalance < 0) {
      balanceFooter = (
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#ba1a1a' }}>trending_down</span>
          <span className="text-label-md" style={{ color: '#ba1a1a' }}>Budget deficit</span>
        </div>
      );
    } else {
      balanceFooter = (
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#777587' }}>balance</span>
          <span className="text-label-md" style={{ color: '#777587' }}>Fully balanced budget</span>
        </div>
      );
    }
  }

  // 2. Monthly Income Footer (Savings Rate Progress Bar)
  let savingsRate = 0;
  let incomeFooterText = 'No active income recorded';
  if (summary.monthlyIncome > 0) {
    const netSavings = summary.monthlyIncome - summary.monthlyExpenses;
    savingsRate = Math.max(0, Math.min(100, Math.round((netSavings / summary.monthlyIncome) * 100)));
    incomeFooterText = `${savingsRate}% of income saved`;
  }
  const incomeFooter = (
    <div className="space-y-1.5 w-full">
      <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden" style={{ background: '#dce9ff' }}>
        <div 
          className="h-full rounded-full transition-all duration-500" 
          style={{ width: `${savingsRate}%`, background: '#39b8fd' }} 
        />
      </div>
      <p className="text-label-md text-on-surface-variant uppercase tracking-wider" style={{ fontSize: '10px' }}>
        {incomeFooterText}
      </p>
    </div>
  );

  // 3. Monthly Expenses Footer
  let expensesFooter = (
    <div className="flex items-center gap-1">
      <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#777587' }}>info</span>
      <span className="text-label-md" style={{ color: '#777587' }}>No outlays logged</span>
    </div>
  );
  if (summary.monthlyExpenses > 0) {
    if (summary.monthlyIncome > 0) {
      const expensePct = Math.round((summary.monthlyExpenses / summary.monthlyIncome) * 100);
      if (expensePct <= 100) {
        expensesFooter = (
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#16a34a' }}>check_circle</span>
            <span className="text-label-md" style={{ color: '#16a34a' }}>Consumes {expensePct}% of income</span>
          </div>
        );
      } else {
        expensesFooter = (
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#ba1a1a' }}>warning</span>
            <span className="text-label-md" style={{ color: '#ba1a1a' }}>Exceeds income by {expensePct - 100}%</span>
          </div>
        );
      }
    } else {
      expensesFooter = (
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#777587' }}>info</span>
          <span className="text-label-md" style={{ color: '#777587' }}>Log income to check saving rate</span>
        </div>
      );
    }
  }

  const cards = [
    {
      id: 'total-balance',
      label: 'Total Balance',
      value: formattedBalance,
      icon: 'account_balance_wallet',
      iconColor: '#3525cd',
      accent: '#e2dfff',
      footer: balanceFooter,
    },
    {
      id: 'monthly-income',
      label: 'Monthly Income',
      value: formattedIncome,
      icon: 'payments',
      iconColor: '#006591',
      accent: '#c9e6ff',
      footer: incomeFooter,
    },
    {
      id: 'monthly-expenses',
      label: 'Monthly Expenses',
      value: formattedExpenses,
      icon: 'shopping_cart',
      iconColor: '#ba1a1a',
      accent: '#ffdad6',
      footer: expensesFooter,
    },
    {
      id: 'top-category',
      label: 'Top Category',
      value: formattedTopCategory,
      icon: 'restaurant',
      iconColor: '#7e3000',
      accent: '#ffdbcc',
      footer: (
        <p className="text-label-md tracking-wider animate-fade-in" style={{ color: '#777587' }}>
          {summary.topCategory === 'None' ? 'NO EXPENSES SPENT' : `TOTAL: ${topCategoryVal} THIS MONTH`}
        </p>
      ),
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, i) => (
        <div
          key={card.id}
          className="rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 animate-fade-in"
          style={{
            background: '#ffffff',
            border: '1px solid #e5eeff',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            animationDelay: `${i * 0.08}s`,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(53,37,205,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <div>
            <div className="flex justify-between items-start mb-3">
              <span className="text-label-md tracking-wider" style={{ color: '#777587' }}>
                {card.label.toUpperCase()}
              </span>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: card.accent }}>
                <span className="material-symbols-outlined material-symbols-filled"
                  style={{ color: card.iconColor, fontSize: '20px' }}>{card.icon}</span>
              </div>
            </div>
            <p className="text-number-lg" style={{ color: '#0b1c30' }}>{card.value}</p>
          </div>
          <div className="mt-4 flex items-center">{card.footer}</div>
        </div>
      ))}
    </section>
  );
}
