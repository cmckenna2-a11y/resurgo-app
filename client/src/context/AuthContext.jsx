import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, AUTH_STORAGE_KEY } from '../lib/supabase';
import { api, clearApiCache } from '../lib/api';

const PROFILE_CACHE_KEY = 'resurgo-profile';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchProfile(userId) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) {
      setProfile(data);
      try { window.localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(data)); } catch {}
    }
    return data;
  }

  useEffect(() => {
    // STORAGE SAFETY VALVE — iOS limits WebView storage operations to ~10MB.
    // Over many logins the auth storage can accumulate stale blobs and cross
    // that ceiling, which freezes the WebView on cold boot. On each launch we
    // measure total localStorage; if it's bloated, we clear everything EXCEPT
    // the current Supabase session so the user stays logged in but the junk
    // is purged. This keeps storage small forever.
    try {
      let total = 0;
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        const v = window.localStorage.getItem(k);
        total += (k ? k.length : 0) + (v ? v.length : 0);
      }
      // 4MB of UTF-16 chars (~8MB bytes) — well under the 10MB hard limit.
      if (total > 4_000_000) {
        const keep = window.localStorage.getItem(AUTH_STORAGE_KEY);
        const keepProfile = window.localStorage.getItem(PROFILE_CACHE_KEY);
        window.localStorage.clear();
        if (keep) window.localStorage.setItem(AUTH_STORAGE_KEY, keep);
        if (keepProfile) window.localStorage.setItem(PROFILE_CACHE_KEY, keepProfile);
      }
    } catch {}

    let resolved = false;
    let initCancelled = false;
    const unblock = () => { if (!resolved) { resolved = true; setLoading(false); } };

    // STEP 1 — Read the stored session straight from localStorage, with zero
    // network. On a cold start with an expired token, getSession() tries a
    // blocking refresh over the network that can hang on weak morning signal.
    // We don't wait for that. We trust the stored session to render the app
    // immediately; autoRefreshToken renews the token in the background.
    function readStoredSession() {
      try {
        const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        return parsed?.user ? parsed : null;
      } catch {
        return null;
      }
    }

    const stored = readStoredSession();
    if (stored?.user) {
      // We have a logged-in user on disk. Render the app NOW, before any
      // network call. This is what kills the morning freeze.
      setUser(stored.user);
      // Also restore the cached profile so App.jsx's !profile guard doesn't
      // show a loading spinner while fetchProfile() makes its network call.
      try {
        const cachedProfile = JSON.parse(window.localStorage.getItem(PROFILE_CACHE_KEY));
        if (cachedProfile) setProfile(cachedProfile);
      } catch {}
      fetchProfile(stored.user.id).catch(() => {});
      unblock();
    }

    // Failsafe: even with no stored session, never hang on the loading screen.
    const failsafe = setTimeout(unblock, 3000);

    async function init(attempt = 0) {
      try {
        // Race getSession against a hard 2s cap. If the blocking refresh is
        // slow, we don't care — we've already rendered from the stored
        // session above, and the background refresh will catch up.
        const sessionRes = await Promise.race([
          supabase.auth.getSession(),
          new Promise((res) => setTimeout(() => res({ data: { session: null }, timedOut: true }), 2000)),
        ]);
        if (initCancelled) return;
        const timedOut = sessionRes?.timedOut;
        const session = sessionRes?.data?.session;
        if (session) {
          setUser(session.user);
          // Always fetch from network — rescues cases where the cold-start
          // profile fetch above failed due to a brief connectivity blip.
          fetchProfile(session.user.id).catch(() => {});
        } else if (!timedOut) {
          // getSession returned a confirmed null (not a timeout): the stored
          // token is dead (revoked / refresh token expired). Clear auth state.
          setUser(null);
          setProfile(null);
        }
        unblock();
      } catch {
        if (initCancelled) return;
        // Only retry if we had nothing stored to fall back on.
        if (attempt < 1 && !stored?.user) {
          setTimeout(() => init(attempt + 1), 600);
        } else {
          unblock();
        }
      }
    }
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // INITIAL_SESSION is handled by init() above.
      // TOKEN_REFRESHED only rotates the token — user/profile state doesn't
      // change and triggering a fetchProfile on every background refresh
      // (every ~55 min) wastes a DB round-trip.
      if (event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') return;
      // Cancel any in-flight init() so a concurrent logout isn't overwritten.
      if (event === 'SIGNED_OUT') initCancelled = true;
      // The signed-in user changed — drop any cached API data so the next
      // user never sees the previous user's mood history.
      if (event === 'SIGNED_OUT' || event === 'SIGNED_IN') clearApiCache();
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
    clearApiCache();
    setUser(null);
    setProfile(null);
    try { window.localStorage.removeItem(PROFILE_CACHE_KEY); } catch {}
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
    try { window.localStorage.removeItem(PROFILE_CACHE_KEY); } catch {}
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
