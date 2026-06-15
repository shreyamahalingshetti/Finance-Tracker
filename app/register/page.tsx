'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    const result = await register(name, email, password);
    setIsLoading(false);

    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Registration failed.');
    }
  }

  const fields = [
    { id: 'reg-name',     label: 'FULL NAME',        icon: 'person',    type: 'text',     value: name,            setter: setName,            placeholder: 'Alex Rivera' },
    { id: 'reg-email',    label: 'EMAIL ADDRESS',     icon: 'mail',      type: 'email',    value: email,           setter: setEmail,           placeholder: 'you@example.com' },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #f8f9ff 0%, #e5eeff 50%, #dce9ff 100%)' }}>

      {/* ── Left Panel: Branding ── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #3525cd 0%, #4f46e5 60%, #6c63ff 100%)' }}>
        <div className="absolute top-[-80px] right-[-80px] w-80 h-80 rounded-full opacity-10" style={{ background: 'white' }} />
        <div className="absolute bottom-[-60px] left-[-60px] w-64 h-64 rounded-full opacity-10" style={{ background: 'white' }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
              <span className="material-symbols-outlined material-symbols-filled text-white" style={{ fontSize: '22px' }}>account_balance_wallet</span>
            </div>
            <div>
              <h1 className="text-headline-sm text-white font-bold">FinControl</h1>
              <p className="text-label-md text-white opacity-70 tracking-wider">PROFESSIONAL SUITE</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-white font-bold" style={{ fontSize: '40px', lineHeight: '48px' }}>
              Your journey to financial freedom starts here.
            </h2>
            <p className="text-body-lg text-white opacity-80">
              Join thousands who use FinControl to build better money habits and achieve their goals.
            </p>
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { value: '50K+', label: 'Active Users' },
                { value: '$2M+', label: 'Tracked Monthly' },
                { value: '98%', label: 'Satisfaction' },
                { value: '4.9★', label: 'User Rating' },
              ].map((s) => (
                <div key={s.label} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <p className="text-number-lg text-white font-bold">{s.value}</p>
                  <p className="text-label-md text-white opacity-70 tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="relative z-10 text-label-md text-white opacity-50">© 2026 FinControl. All rights reserved.</p>
      </div>

      {/* ── Right Panel: Register Form ── */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-in">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#4f46e5' }}>
              <span className="material-symbols-outlined material-symbols-filled text-white" style={{ fontSize: '22px' }}>account_balance_wallet</span>
            </div>
            <div>
              <h1 className="text-headline-sm font-bold" style={{ color: '#3525cd' }}>FinControl</h1>
              <p className="text-label-md tracking-wider" style={{ color: '#777587' }}>PROFESSIONAL SUITE</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-headline-md mb-2" style={{ color: '#0b1c30' }}>Create your account</h2>
            <p className="text-body-lg" style={{ color: '#464555' }}>Start tracking your finances in minutes.</p>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl animate-fade-in"
              style={{ background: '#ffdad6', border: '1px solid #ffb4ab' }}>
              <span className="material-symbols-outlined" style={{ color: '#ba1a1a', fontSize: '20px' }}>error</span>
              <p className="text-body-md font-medium" style={{ color: '#93000a' }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name + Email */}
            {fields.map((f) => (
              <div key={f.id}>
                <label className="block text-label-md mb-2 tracking-wider" style={{ color: '#464555' }}>{f.label}</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: '#777587', fontSize: '20px' }}>{f.icon}</span>
                  <input
                    id={f.id}
                    type={f.type}
                    value={f.value}
                    onChange={(e) => f.setter(e.target.value)}
                    placeholder={f.placeholder}
                    className="w-full pl-12 pr-4 py-3 rounded-xl text-body-lg transition-all duration-200"
                    style={{ background: '#ffffff', border: '1.5px solid #c7c4d8', color: '#0b1c30' }}
                    onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
                    onBlur={(e) => e.target.style.borderColor = '#c7c4d8'}
                  />
                </div>
              </div>
            ))}

            {/* Password */}
            <div>
              <label className="block text-label-md mb-2 tracking-wider" style={{ color: '#464555' }}>PASSWORD</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: '#777587', fontSize: '20px' }}>lock</span>
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full pl-12 pr-12 py-3 rounded-xl text-body-lg transition-all duration-200"
                  style={{ background: '#ffffff', border: '1.5px solid #c7c4d8', color: '#0b1c30' }}
                  onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
                  onBlur={(e) => e.target.style.borderColor = '#c7c4d8'}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: '#777587' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-label-md mb-2 tracking-wider" style={{ color: '#464555' }}>CONFIRM PASSWORD</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: '#777587', fontSize: '20px' }}>lock_reset</span>
                <input
                  id="reg-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full pl-12 pr-4 py-3 rounded-xl text-body-lg transition-all duration-200"
                  style={{
                    background: '#ffffff',
                    border: `1.5px solid ${confirmPassword && confirmPassword !== password ? '#ba1a1a' : '#c7c4d8'}`,
                    color: '#0b1c30',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
                  onBlur={(e) => e.target.style.borderColor = (confirmPassword && confirmPassword !== password) ? '#ba1a1a' : '#c7c4d8'}
                />
              </div>
              {confirmPassword && confirmPassword !== password && (
                <p className="text-label-md mt-1" style={{ color: '#ba1a1a' }}>Passwords don&apos;t match</p>
              )}
            </div>

            {/* Submit */}
            <button
              id="register-submit"
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl text-body-lg font-bold flex items-center justify-center gap-2 transition-all duration-200 mt-2"
              style={{
                background: isLoading ? '#9ca3af' : 'linear-gradient(135deg, #3525cd, #4f46e5)',
                color: '#ffffff',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                boxShadow: isLoading ? 'none' : '0 4px 15px rgba(53, 37, 205, 0.3)',
              }}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Creating account…
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>person_add</span>
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-body-md" style={{ color: '#464555' }}>
              Already have an account?{' '}
              <Link href="/login" className="font-bold transition-colors duration-150" style={{ color: '#3525cd' }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
