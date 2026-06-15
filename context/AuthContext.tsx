'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getUser, login as authLogin, logout as authLogout, register as authRegister, type User } from '@/lib/auth';

// ─────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

// ─────────────────────────────────────────────
//  Context
// ─────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─────────────────────────────────────────────
//  Provider
// ─────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hydrate session from localStorage on mount
    setUser(getUser());
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = authLogin(email, password);
    if (result.success) setUser(getUser());
    return result;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const result = authRegister(name, email, password);
    if (result.success) setUser(getUser());
    return result;
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─────────────────────────────────────────────
//  Hook
// ─────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
