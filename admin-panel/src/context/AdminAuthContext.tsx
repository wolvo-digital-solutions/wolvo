import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { AdminUser } from '@/types/cms';
import {
  getCurrentAdmin,
  loginAdmin,
  registerAdmin,
  logoutAdmin,
  isSupabaseConfigured,
  supabase,
} from '@/lib/supabase';

interface AdminAuthContextType {
  admin: AdminUser | null;
  isLoading: boolean;
  isConfigured: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  // Synchronously initialize from cached session to prevent flash of login screen on page refresh
  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    try {
      const raw = localStorage.getItem('wolvo_cms_admin_session');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // If we already have a cached session, we don't need a full-screen blocking loader
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem('wolvo_cms_admin_session');
      return !raw;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    let mounted = true;

    async function verifySession() {
      try {
        const current = await getCurrentAdmin();
        if (mounted) {
          if (current) {
            setAdmin(current);
          } else {
            // Only clear admin if Supabase explicitly has no session
            if (isSupabaseConfigured && supabase) {
              const { data } = await supabase.auth.getSession();
              if (!data.session) {
                setAdmin(null);
                localStorage.removeItem('wolvo_cms_admin_session');
              }
            } else {
              setAdmin(null);
              localStorage.removeItem('wolvo_cms_admin_session');
            }
          }
        }
      } catch (err) {
        console.warn('[AdminAuth] Session verification error:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    verifySession();

    if (isSupabaseConfigured && supabase) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;

        if (event === 'SIGNED_OUT') {
          setAdmin(null);
          localStorage.removeItem('wolvo_cms_admin_session');
        } else if (session?.user) {
          const current = await getCurrentAdmin();
          if (mounted && current) {
            setAdmin(current);
          }
        }
      });

      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    }

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const user = await loginAdmin(email, pass);
      setAdmin(user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const user = await registerAdmin(email, pass);
      setAdmin(user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutAdmin();
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isLoading,
        isConfigured: isSupabaseConfigured,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used inside AdminAuthProvider');
  return ctx;
}
