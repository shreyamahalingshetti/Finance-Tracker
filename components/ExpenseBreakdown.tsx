'use client';

import { useFinance } from '@/hooks/useFinance';

export default function ExpenseBreakdown() {
  const { summary } = useFinance();

  const segments = summary.expenseBreakdown || [];

  // Build conic-gradient from segments
  let cumulative = 0;
  const conicParts = segments.map((seg) => {
    const start = cumulative;
    cumulative += seg.pct;
    return `${seg.color} ${start}% ${cumulative}%`;
  }).join(', ');

  const totalSpentFormatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(summary.monthlyExpenses);

  return (
    <div className="rounded-2xl p-6"
      style={{ background: '#ffffff', border: '1px solid #e5eeff', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>

      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#e2dfff' }}>
          <span className="material-symbols-outlined" style={{ color: '#3525cd', fontSize: '18px' }}>pie_chart</span>
        </div>
        <h3 className="text-headline-sm" style={{ color: '#0b1c30' }}>Expense Breakdown</h3>
      </div>

      <div className="flex items-center justify-center gap-8 flex-wrap">
        {/* Donut chart */}
        <div className="relative flex-shrink-0">
          <div
            className="w-44 h-44 rounded-full transition-transform duration-300"
            style={{
              background: segments.length > 0 && summary.monthlyExpenses > 0
                ? `conic-gradient(${conicParts})`
                : '#eff4ff',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.04)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          />
          {/* Donut hole */}
          <div className="absolute inset-0 flex flex-col items-center justify-center"
            style={{
              margin: '20px',
              background: '#ffffff',
              borderRadius: '50%',
            }}>
            <span className="text-label-md tracking-wider" style={{ color: '#777587' }}>TOTAL SPENT</span>
            <span className="text-headline-sm font-bold" style={{ color: '#0b1c30' }}>{totalSpentFormatted}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3">
          {summary.monthlyExpenses > 0 ? (
            segments.map((seg) => (
              <div key={seg.label} className="flex items-center gap-3 group cursor-default">
                <div className="w-3 h-3 rounded-full flex-shrink-0 transition-transform duration-200 group-hover:scale-125"
                  style={{ background: seg.color }} />
                <div>
                  <p className="text-body-md font-semibold" style={{ color: '#0b1c30' }}>{seg.label}</p>
                  <p className="text-label-md" style={{ color: '#777587' }}>
                    ₹{seg.amount.toFixed(2)} ({seg.pct}%)
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-body-md" style={{ color: '#777587' }}>
              No expenses recorded yet.
            </div>
          )}
        </div>
      </div>

      {/* Progress bars */}
      <div className="mt-6 space-y-3">
        {summary.monthlyExpenses > 0 ? (
          segments.map((seg) => (
            <div key={seg.label}>
              <div className="flex justify-between mb-1">
                <span className="text-label-md font-semibold" style={{ color: '#464555' }}>{seg.label}</span>
                <span className="text-label-md" style={{ color: '#777587' }}>{seg.pct}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: '#e5eeff' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${seg.pct}%`, background: seg.color }}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-label-md py-4" style={{ color: '#777587' }}>
            Enter an expense to view progress metrics.
          </div>
        )}
      </div>
    </div>
  );
}
