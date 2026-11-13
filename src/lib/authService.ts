import { supabase, isSupabaseConfigured } from './supabaseClient';

const DEMO_ADMIN_SESSION_KEY = 'parish_demo_admin_active';

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  isSupabaseAuth: boolean;
}

export const authService = {
  async getSessionUser(): Promise<AdminUser | null> {
    // 1. Check live Supabase Auth session first
    if (isSupabaseConfigured && supabase) {
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          return {
            id: data.user.id,
            email: data.user.email || 'Admin',
            role: 'Parish Administrator',
            isSupabaseAuth: true,
          };
        }
      } catch (err) {
        console.error('Error fetching Supabase auth session:', err);
      }
    }

    // 2. Check local admin session fallback
    if (typeof window !== 'undefined') {
      const isDemo = window.localStorage.getItem(DEMO_ADMIN_SESSION_KEY);
      if (isDemo === 'true') {
        return {
          id: 'admin-local-id',
          email: 'admin (Local Session)',
          role: 'Parish Administrator',
          isSupabaseAuth: false,
        };
      }
    }

    return null;
  },

  async login(usernameOrEmail: string, password: string): Promise<{ success: boolean; error?: string }> {
    const cleanUser = (usernameOrEmail || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanUser || !cleanPass) {
      return { success: false, error: 'Please enter both username and password.' };
    }

    // 1. Try real Supabase Auth first so we obtain the 'to authenticated' JWT token
    if (isSupabaseConfigured && supabase) {
      // Allow shorthand "admin" or full email
      const emailCandidates = cleanUser.includes('@')
        ? [cleanUser]
        : [
            `${cleanUser}@pallikkunnu.org`,
            `${cleanUser}@assumptionchurch.com`,
            `${cleanUser}@parish.org`,
          ];

      // If user typed short password "admin", also test "admin123" (since Supabase requires 6+ chars)
      const passCandidates = cleanPass.length < 6 ? [cleanPass, `${cleanPass}123`, `${cleanPass}admin`] : [cleanPass];

      for (const email of emailCandidates) {
        for (const pwd of passCandidates) {
          try {
            const { data, error } = await supabase.auth.signInWithPassword({
              email,
              password: pwd,
            });

            if (!error && data?.session) {
              if (typeof window !== 'undefined') {
                window.localStorage.removeItem(DEMO_ADMIN_SESSION_KEY);
              }
              return { success: true };
            }
          } catch {
            // continue checking
          }
        }
      }
    }

    // 2. Fallback: local admin bypass if credentials match admin / admin
    if (
      (cleanUser === 'admin' || cleanUser === 'admin@pallikkunnu.org') &&
      (cleanPass === 'admin' || cleanPass === 'admin123')
    ) {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(DEMO_ADMIN_SESSION_KEY, 'true');
      }
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid login. If you created a user in Supabase, enter your registered email and password.',
    };
  },

  async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(DEMO_ADMIN_SESSION_KEY);
    }
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Error during Supabase signout:', err);
      }
    }
  },
};
