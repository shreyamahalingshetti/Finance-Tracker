// ─────────────────────────────────────────────
//  lib/auth.ts  ·  Local-storage auth utilities
// ─────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface StoredUser extends User {
  passwordHash: string;
}

const USERS_KEY = 'fincontrol_users';
const SESSION_KEY = 'fincontrol_session';

// ── helpers ──────────────────────────────────

function hashPassword(password: string): string {
  // Simple deterministic hash (not cryptographic — for local-only demo)
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return btoa(String(hash));
}

function getStoredUsers(): StoredUser[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveStoredUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// ── public API ───────────────────────────────

export function register(
  name: string,
  email: string,
  password: string
): { success: boolean; error?: string } {
  const users = getStoredUsers();
  const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) return { success: false, error: 'An account with this email already exists.' };

  const newUser: StoredUser = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash: hashPassword(password),
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4f46e5&color=ffffff&bold=true`,
  };

  saveStoredUsers([...users, newUser]);
  // Auto-login after register
  localStorage.setItem(SESSION_KEY, JSON.stringify({ id: newUser.id, email: newUser.email, name: newUser.name, avatar: newUser.avatar }));
  return { success: true };
}

export function login(
  email: string,
  password: string
): { success: boolean; error?: string } {
  const users = getStoredUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user) return { success: false, error: 'No account found with this email.' };
  if (user.passwordHash !== hashPassword(password)) {
    return { success: false, error: 'Incorrect password. Please try again.' };
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify({ id: user.id, email: user.email, name: user.name, avatar: user.avatar }));
  return { success: true };
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getUser() !== null;
}
