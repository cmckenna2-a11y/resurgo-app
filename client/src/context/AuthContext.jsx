import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { api } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchProfile(userId) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) setProfile(data);
    return data;
  }

  useEffect(() => {
    let resolved = false;
    const unblock = () => { if (!resolved) { resolved = true; setLoading(false); } };

    // Hard safety net: on a cold start the Capacitor WebView network bridge
    // can be slow to come up, and getSession() may hang without resolving or
    // rejecting. This guarantees the app renders no matter what after 4s.
    const failsafe = setTimeout(unblock, 3000);

    async function init(attempt = 0) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUser(session.user);
          // Unblock the UI immediately once we have a session. The profile
          // fetch is a network call that can hang on a weak cold-start
          // connection, so we do NOT await it before rendering. It loads in
          // the background and updates state when it returns.
          fetchProfile(session.user.id).catch(() => {});
        }
        unblock();
      } catch {
        // Retry once — the first call can fire before the bridge is ready.
        if (attempt < 1) {
          setTimeout(() => init(attempt + 1), 600);
        } else {
          unblock();
        }
      }
    }
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'INITIAL_SESSION') return; // already handled by init() above
      if (session) {
        setUser(session.user);
        try { await fetchProfile(session.user.id); } catch {}
      } else {
        setUser(null);
        setProfile(null);
      }
      unblock();
    });

    return () => { clearTimeout(failsafe); subscription.unsubscribe(); };
  }, []);

  async function signup({ name, email, password, role }) {
    // Pass name and role as user metadata — the DB trigger on auth.users
    // reads these to create the profiles row automatically (SECURITY DEFINER,
    // bypasses RLS), so we never need a client-side INSERT on profiles.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role } },
    });
    if (error) throw error;
    return data.user;
  }

  async function login({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }

  async function updateProfile(updates) {
    if (!user) return;
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
    if (error) throw error;
    setProfile(data);
    return data;
  }

  async function deleteAccount() {
    if (!user) return;
    // Backend deletes all data AND the auth user (service role).
    await api.account.delete();
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signup, login, logout, updateProfile, deleteAccount, refreshProfile: () => user && fetchProfile(user.id) }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
