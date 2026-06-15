'use client';

import { useFinance } from '@/hooks/useFinance';

export default function AccountsPage() {
  const { summary } = useFinance();

  const formattedBalance = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(summary.totalBalance);

  const formattedExpenses = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(summary.monthlyExpenses);

  const formattedIncome = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(summary.monthlyIncome);

  const accounts = [
    { name: 'Cash Wallet', type: 'Cash', balance: summary.totalBalance * 0.3, icon: 'payments', bg: '#eff4ff', color: '#3525cd' },
    { name: 'SBI Savings Account', type: 'Bank Account', balance: summary.totalBalance * 0.7, icon: 'account_balance', bg: '#e2dfff', color: '#3323cc' },
    { name: 'HDFC Credit Card', type: 'Credit Card', balance: -summary.monthlyExpenses * 0.4, icon: 'credit_card', bg: '#ffdad6', color: '#ba1a1a' },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div>
        <h2 className="text-headline-md" style={{ color: '#0b1c30' }}>Accounts & Portfolios</h2>
        <p className="text-body-md mt-1" style={{ color: '#777587' }}>
          Manage your cash wallets, bank ledgers, and credit limits.
        </p>
      </div>

      {/* Stats Summary */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { label: 'NET WORTH', value: formattedBalance, color: '#3525cd', icon: 'shield_with_heart' },
          { label: 'TOTAL DEBTS', value: formattedExpenses, color: '#ba1a1a', icon: 'credit_card_off' },
          { label: 'MONTHLY LIQUIDITY', value: formattedIncome, color: '#006591', icon: 'water_drop' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl p-6 bg-white border border-e5eeff shadow-sm flex justify-between items-center">
            <div>
              <p className="text-label-md tracking-wider mb-2" style={{ color: '#777587' }}>{stat.label}</p>
              <h3 className="text-headline-sm font-bold" style={{ color: stat.color }}>{stat.value}</h3>
            </div>
            <span className="material-symbols-outlined text-[32px]" style={{ color: stat.color }}>{stat.icon}</span>
          </div>
        ))}
      </section>

      {/* Account Ledgers List */}
      <div className="rounded-2xl p-6 bg-white border border-e5eeff shadow-sm">
        <h3 className="text-headline-sm mb-5" style={{ color: '#0b1c30' }}>Linked Accounts</h3>
        
        <div className="divide-y divide-f0f4ff space-y-4">
          {accounts.map((acc, i) => {
            const bal = new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
            }).format(acc.balance);
            return (
              <div key={acc.name} className="flex justify-between items-center py-4 first:pt-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: acc.bg }}>
                    <span className="material-symbols-outlined material-symbols-filled"
                      style={{ color: acc.color, fontSize: '22px' }}>{acc.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-body-md font-bold" style={{ color: '#0b1c30' }}>{acc.name}</h4>
                    <p className="text-label-md" style={{ color: '#777587' }}>{acc.type}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-body-md font-bold" style={{ color: acc.balance >= 0 ? '#0b1c30' : '#ba1a1a' }}>
                    {bal}
                  </p>
                  <p className="text-label-md" style={{ color: '#777587' }}>Active State</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
