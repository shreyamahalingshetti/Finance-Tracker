'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useFinance } from '@/hooks/useFinance';
import { saveTransactions } from '@/lib/finance';

export default function SettingsPage() {
  const { user } = useAuth();
  const { refreshData } = useFinance();

  const [name, setName] = useState(user?.name || '');
  const [success, setSuccess] = useState('');

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || typeof window === 'undefined') return;

    try {
      // Update session storage
      const session = JSON.parse(localStorage.getItem('fincontrol_session') || '{}');
      session.name = name.trim();
      session.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=4f46e5&color=ffffff&bold=true`;
      localStorage.setItem('fincontrol_session', JSON.stringify(session));

      // Update users database
      const users = JSON.parse(localStorage.getItem('fincontrol_users') || '[]');
      const updatedUsers = users.map((u: any) => {
        if (u.email.toLowerCase() === user?.email.toLowerCase()) {
          return { ...u, name: name.trim(), avatar: session.avatar };
        }
        return u;
      });
      localStorage.setItem('fincontrol_users', JSON.stringify(updatedUsers));

      setSuccess('Profile updated successfully! Refreshing details...');
      setTimeout(() => {
        setSuccess('');
        window.location.reload();
      }, 1500);
    } catch {
      // fail silently
    }
  }

  function handleClearData() {
    if (!user?.email || typeof window === 'undefined') return;
    if (confirm('Are you sure you want to delete ALL of your transactions? This cannot be undone.')) {
      saveTransactions(user.email, []);
      window.dispatchEvent(new Event('finance_update'));
      refreshData();
      alert('All transactions cleared successfully.');
    }
  }

  const inputStyle = {
    background: '#f8f9ff',
    border: '1.5px solid #e5eeff',
    color: '#0b1c30',
    borderRadius: '10px',
    padding: '10px 14px',
    fontSize: '14px',
    width: '100%',
    fontFamily: 'Inter, sans-serif',
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div>
        <h2 className="text-headline-md" style={{ color: '#0b1c30' }}>Settings</h2>
        <p className="text-body-md mt-1" style={{ color: '#777587' }}>
          Manage your personal profile and data backups.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="rounded-2xl p-6 bg-white border border-e5eeff shadow-sm">
          <h3 className="text-headline-sm mb-4" style={{ color: '#0b1c30' }}>Profile Configuration</h3>
          
          {success && (
            <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-green-100 border border-green-300 text-green-800 text-body-md">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check_circle</span>
              <p>{success}</p>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-label-md mb-2" style={{ color: '#777587' }}>FULL NAME</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
                required
              />
            </div>
            <div>
              <label className="block text-label-md mb-2" style={{ color: '#777587' }}>EMAIL ADDRESS</label>
              <input
                type="email"
                value={user?.email || ''}
                style={{ ...inputStyle, opacity: 0.6, cursor: 'not-allowed' }}
                disabled
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold text-white transition-all"
              style={{
                background: 'linear-gradient(135deg, #3525cd, #4f46e5)',
                fontSize: '14px',
              }}
            >
              Save Profile Changes
            </button>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="rounded-2xl p-6 bg-white border border-e5eeff shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-headline-sm text-error mb-2">Danger Zone</h3>
            <p className="text-body-md mb-5" style={{ color: '#777587' }}>
              Warning: Actions in this section are permanent and cannot be reversed.
            </p>
          </div>
          <div>
            <button
              onClick={handleClearData}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2"
              style={{
                background: '#ba1a1a',
                fontSize: '14px',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete_forever</span>
              Reset & Clear Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
