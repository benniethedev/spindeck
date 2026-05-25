/**
 * ArtistAuthContext
 * Provides auth state and methods for the artist portal.
 * Manages token lifecycle, user state, and protects routes.
 */
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';

export interface ArtistUser {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
}

interface ArtistAuthContextType {
  user: ArtistUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<boolean>;
}

const ArtistAuthContext = createContext<ArtistAuthContextType | null>(null);

const TOKEN_KEY = 'spin_token';
const USER_KEY = 'spin_user';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

function getUser(): ArtistUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as ArtistUser; } catch { return null; }
}

function setSession(token: string, user: ArtistUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function ArtistAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ArtistUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const storedUser = getUser();
    if (token && storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || 'Login failed' };
      setSession(data.token, data.user);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message || 'Network error' };
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error || 'Signup failed' };
      setSession(`spin_${Date.now()}`, data.user);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message || 'Network error' };
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async (): Promise<boolean> => {
    const token = getToken();
    if (!token) { setUser(null); return false; }
    try {
      const res = await fetch('/api/auth/session', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { clearSession(); setUser(null); return false; }
      const data = await res.json();
      setUser(data.user);
      return true;
    } catch {
      clearSession();
      setUser(null);
      return false;
    }
  }, []);

  return (
    <ArtistAuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </ArtistAuthContext.Provider>
  );
}

export function useArtistAuth(): ArtistAuthContextType {
  const ctx = useContext(ArtistAuthContext);
  if (!ctx) throw new Error('useArtistAuth must be used within ArtistAuthProvider');
  return ctx;
}

export default ArtistAuthContext;
