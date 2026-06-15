'use client';

import { useFinance } from '@/hooks/useFinance';

export default function InsightsPanel() {
  const { transactions, summary } = useFinance();

  // Generate dynamic insights based on actual user transactions
  const insights = [];

  const formattedBalance = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(Math.abs(summary.totalBalance));

  const formattedExpenses = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(summary.monthlyExpenses);

  const formattedIncome = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(summary.monthlyIncome);

  if (transactions.length === 0) {
    // Empty state recommendations
    insights.push(
      {
        id: 'welcome',
        icon: 'waving_hand',
        iconColor: '#ffdbcc',
        title: 'Welcome to FinControl!',
        body: 'Log your first income or expense transaction to unlock personalized financial insights and smart recommendation alerts.',
      },
      {
        id: 'tip-1',
        icon: 'tips_and_updates',
        iconColor: '#86efac',
        title: 'Smart Tip: Categorization',
        body: 'Categorize your expenses (like Food, Shopping, Housing) to generate visual breakdowns and detect spending trends.',
      },
      {
        id: 'tip-2',
        icon: 'security',
        iconColor: '#89ceff',
        title: 'Data Privacy & Security',
        body: 'Your financial data is stored locally in your browser storage. Nobody else can access or see your records.',
      }
    );
  } else {
    // Dynamic insights based on actual records
    
    // Balance insight
    if (summary.totalBalance < 0) {
      insights.push({
        id: 'negative-balance',
        icon: 'warning',
        iconColor: '#ffb4ab',
        title: 'Budget Deficit Alert',
        body: `Your net balance is currently negative (${formattedBalance}). Consider auditing recent shopping or housing costs to balance your budget.`,
      });
    } else if (summary.totalBalance > 0 && summary.monthlyExpenses > 0) {
      const savingsPct = Math.round(((summary.monthlyIncome - summary.monthlyExpenses) / summary.monthlyIncome) * 100);
      if (savingsPct > 20) {
        insights.push({
          id: 'savings-good',
          icon: 'verified',
          iconColor: '#86efac',
          title: 'Strong Savings Rate!',
          body: `Excellent! You've saved ${savingsPct}% of your income this month. Keep up this healthy saving rate to meet your goals early.`,
        });
      }
    }

    // Top Category insight
    if (summary.topCategory !== 'None' && summary.topCategoryAmount > 0) {
      const categoryPct = Math.round((summary.topCategoryAmount / summary.monthlyExpenses) * 100);
      insights.push({
        id: 'top-spending',
        icon: 'trending_up',
        iconColor: '#ffdbcc',
        title: 'Spending Concentration',
        body: `Your highest expense is "${summary.topCategory}", which accounts for ${categoryPct}% of your total spending. Keep an eye on this category.`,
      });
    }

    // Subscription detection
    const subscriptions = transactions.filter(t => 
      t.type === 'Expense' && 
      /sub|netflix|spotify|youtube|prime|member|icloud|adobe|stream/i.test(t.note)
    );

    if (subscriptions.length > 0) {
      const sub = subscriptions[0];
      insights.push({
        id: 'subscription-alert',
        icon: 'bolt',
        iconColor: '#89ceff',
        title: 'Recurring Cost Detected',
        body: `We noticed a transaction for "${sub.note}" (₹${sub.amount.toFixed(2)}). Ensure you cancel unused subscriptions to save money.`,
      });
    }

    // Fallback if we have transactions but not enough to trigger specific alerts
    if (insights.length < 2) {
      insights.push({
        id: 'onboarding-done',
        icon: 'insights',
        iconColor: '#c9e6ff',
        title: 'Tracking Active',
        body: `You have logged ${transactions.length} transaction${transactions.length > 1 ? 's' : ''} totaling ₹${summary.monthlyExpenses.toFixed(2)} in expenses. Keep logging daily to see automated recommendations.`,
      });
    }
  }

  return (
    <div
      className="rounded-2xl p-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #3525cd 0%, #4f46e5 60%, #6c63ff 100%)' }}
    >
      {/* Decorative background icon */}
      <div className="absolute top-0 right-0 p-4 pointer-events-none select-none"
        style={{ opacity: 0.06 }}>
        <span className="material-symbols-outlined material-symbols-filled text-white"
          style={{ fontSize: '130px' }}>insights</span>
      </div>
      <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full pointer-events-none"
        style={{ background: 'rgba(255,255,255,0.05)' }} />

      {/* Header */}
      <div className="flex items-center gap-2 mb-5 relative z-10">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.15)' }}>
          <span className="material-symbols-outlined text-white" style={{ fontSize: '18px' }}>auto_awesome</span>
        </div>
        <h3 className="text-headline-sm text-white">Automated Insights</h3>
      </div>

      {/* Insight cards */}
      <div className="space-y-3 relative z-10">
        {insights.map((item, i) => (
          <div
            key={item.id}
            className="flex items-start gap-3 p-4 rounded-xl transition-all duration-200 animate-fade-in cursor-default"
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.12)',
              animationDelay: `${i * 0.1}s`,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
          >
            <span className="material-symbols-outlined flex-shrink-0 mt-0.5"
              style={{ color: item.iconColor, fontSize: '22px' }}>{item.icon}</span>
            <div>
              <p className="text-body-md font-bold text-white mb-1">{item.title}</p>
              <p className="text-body-md text-white" style={{ opacity: 0.8, lineHeight: '1.5' }}>{item.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer link */}
      <div className="mt-5 pt-4 relative z-10" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
        <button
          className="text-label-md font-bold text-white flex items-center gap-1 transition-all duration-200 tracking-wider"
          style={{ opacity: 0.85 }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.85'; }}
        >
          VIEW ALL SMART RECOMMENDATIONS
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chevron_right</span>
        </button>
      </div>
    </div>
  );
}
