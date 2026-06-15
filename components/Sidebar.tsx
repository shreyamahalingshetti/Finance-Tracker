'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

const NAV_ITEMS = [
  { href: '/dashboard',             icon: 'dashboard',       label: 'Dashboard' },
  { href: '/dashboard/transactions', icon: 'receipt_long',    label: 'Transactions' },
  { href: '/dashboard/accounts',     icon: 'account_balance', label: 'Accounts' },
  { href: '/dashboard/settings',     icon: 'settings',        label: 'Settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    router.push('/login');
  }

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 flex flex-col py-6 z-50 animate-slide-left"
      style={{
        background: '#ffffff',
        borderRight: '1px solid #c7c4d8',
        boxShadow: '2px 0 12px rgba(0,0,0,0.04)',
      }}>

      {/* Logo */}
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #3525cd, #4f46e5)' }}>
            <span className="material-symbols-outlined material-symbols-filled text-white" style={{ fontSize: '18px' }}>
              account_balance_wallet
            </span>
          </div>
          <div>
            <h1 className="text-headline-sm" style={{ color: '#3525cd' }}>FinControl</h1>
            <p className="text-label-md tracking-wider" style={{ color: '#777587' }}>PROFESSIONAL SUITE</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center px-4 py-3 rounded-xl gap-3 transition-all duration-200 relative"
              style={{
                color: isActive ? '#3525cd' : '#464555',
                fontWeight: isActive ? 600 : 400,
                background: isActive ? '#eff4ff' : 'transparent',
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = '#f5f8ff'; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                  style={{ background: '#3525cd' }} />
              )}
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>{item.icon}</span>
              <span className="text-body-md">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="px-3 mb-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 rounded-xl gap-3 transition-all duration-200 text-body-md"
          style={{ color: '#ba1a1a' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#ffdad6'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>logout</span>
          Sign Out
        </button>
      </div>

      {/* User Profile */}
      <div className="px-6 pt-4" style={{ borderTop: '1px solid #c7c4d8' }}>
        <div className="flex items-center gap-3">
          {user?.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name}
              width={40}
              height={40}
              className="rounded-full"
              style={{ width: 40, height: 40 }}
            />
          ) : (
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #3525cd, #4f46e5)', fontSize: '16px' }}>
              {user?.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
          )}
          <div className="overflow-hidden">
            <p className="text-body-md font-bold truncate" style={{ color: '#0b1c30' }}>{user?.name ?? 'User'}</p>
            <p className="text-label-md truncate" style={{ color: '#777587' }}>Premium Member</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
