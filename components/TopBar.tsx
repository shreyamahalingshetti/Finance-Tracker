'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

export default function TopBar() {
  const { user } = useAuth();
  const [searchValue, setSearchValue] = useState('');

  return (
    <header
      className="fixed top-0 right-0 h-16 flex items-center justify-between px-6 z-40"
      style={{
        left: '16rem',   /* 256px = sidebar width */
        background: 'rgba(248,249,255,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e5eeff',
        boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
      }}
    >
      {/* Search */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-full w-96 transition-all duration-200"
        style={{ background: '#eff4ff', border: '1.5px solid #e5eeff' }}
      >
        <span className="material-symbols-outlined" style={{ color: '#777587', fontSize: '20px' }}>search</span>
        <input
          type="text"
          placeholder="Search transactions…"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="bg-transparent text-body-md flex-1"
          style={{ color: '#0b1c30', border: 'none' }}
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Avatar + name */}
        <div className="flex items-center gap-2 cursor-pointer">
          {user?.avatar ? (
            <Image src={user.avatar} alt={user.name} width={34} height={34}
              className="rounded-full" style={{ width: 34, height: 34 }} />
          ) : (
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #3525cd, #4f46e5)' }}>
              {user?.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
          )}
          <span className="text-body-md font-semibold hidden sm:block" style={{ color: '#0b1c30' }}>
            {user?.name?.split(' ')[0] ?? 'User'}
          </span>
        </div>
      </div>
    </header>
  );
}
