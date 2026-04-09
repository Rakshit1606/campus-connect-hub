import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

export type UserRole = "student" | "faculty" | "admin";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, role: UserRole, fullName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function fetchUserRole(userId: string): Promise<UserRole> {
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .single();
  return (data?.role as UserRole) || "student";
}

async function fetchProfile(userId: string): Promise<{ full_name: string; avatar_url?: string } | null> {
  const { data } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", userId)
    .single();
  return data;
}

async function buildAppUser(supabaseUser: SupabaseUser): Promise<AppUser> {
  const [role, profile] = await Promise.all([
    fetchUserRole(supabaseUser.id),
    fetchProfile(supabaseUser.id),
  ]);
  return {
    id: supabaseUser.id,
    name: profile?.full_name || supabaseUser.email?.split("@")[0] || "User",
    email: supabaseUser.email || "",
    role,
    avatar: profile?.avatar_url || undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    // Failsafe timeout: force loading to false after 5 seconds
    const timeout = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 5000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      setSession(session);
      if (session?.user) {
        try {
          const appUser = await buildAppUser(session.user);
          if (mounted) setUser(appUser);
        } catch (e) {
          console.error("Error building app user", e);
        }
      } else {
        if (mounted) setUser(null);
      }
      if (mounted) setLoading(false);
    });

    supabase.auth.getSession()
      .then(async ({ data: { session }, error }) => {
        if (!mounted) return;
        if (error) throw error;
        setSession(session);
        if (session?.user) {
          try {
            const appUser = await buildAppUser(session.user);
            if (mounted) setUser(appUser);
          } catch (e) {
            console.error("Error building app user from initial session", e);
          }
        }
      })
      .catch((err) => {
        console.error("Supabase getSession failed:", err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const authPromise = supabase.auth.signInWithPassword({ email, password });
      
      // Fallback timeout to prevent infinite hanging button lock
      const timeoutPromise = new Promise<{ data: any; error: any }>((resolve) => {
        setTimeout(async () => {
          const { data } = await supabase.auth.getSession();
          if (data?.session?.user) {
            resolve({ data, error: null }); // Force success if session exists
          } else {
            resolve({ data: null, error: new Error("Login timed out or failed silently.") });
          }
        }, 4000);
      });

      const { error } = await Promise.race([authPromise, timeoutPromise]);
      if (error) return { success: false, error: error.message };
      
      // Force trigger state update if onAuthStateChange was bypassed
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setSession(session);
        const appUser = await buildAppUser(session.user);
        setUser(appUser);
      }
      
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Login failed unexpectedly." };
    }
  };

  const signup = async (email: string, password: string, role: UserRole, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, role } },
    });
    if (error) return { success: false, error: error.message };
    if (data.user) {
      // Insert profile and role
      await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: fullName,
        email,
      });
      await supabase.from("user_roles").upsert({
        user_id: data.user.id,
        role,
      });
    }
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, login, signup, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
