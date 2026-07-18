import { supabase } from './supabase';

async function authHeaders() {
  // getSession() can hang on a stale token over a weak connection. Race it
  // against a timeout so an API call fails fast instead of hanging forever.
  const sessionResult = await Promise.race([
    supabase.auth.getSession(),
    new Promise((_, rej) => setTimeout(() => rej(new Error('Session timeout')), 8000)),
  ]);
  const session = sessionResult?.data?.session;
  if (!session) throw new Error('Not authenticated');
  return { Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'application/json' };
}

const API_BASE = import.meta.env.VITE_API_URL || '';

async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = await authHeaders();
  const res = await fetch(url, { ...options, headers: { ...headers, ...options.headers } });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

let moodsCache = null;
let moodsCacheAt = 0;
const MOODS_TTL = 60_000;

// Must be called whenever the signed-in user changes (logout / new login) —
// otherwise the next user on the same device can see the previous user's
// mood history until the TTL expires.
export function clearApiCache() {
  moodsCache = null;
  moodsCacheAt = 0;
}

export const api = {
  moods: {
    list: () => {
      if (moodsCache && Date.now() - moodsCacheAt < MOODS_TTL) return Promise.resolve(moodsCache);
      return apiFetch('/api/moods').then(d => { moodsCache = d; moodsCacheAt = Date.now(); return d; });
    },
    save: (mood, date) => {
      moodsCache = null;
      return apiFetch('/api/moods', { method: 'POST', body: JSON.stringify({ mood, date }) });
    },
  },
  journals: {
    list: () => apiFetch('/api/journals'),
    save: (entry) => apiFetch('/api/journals', { method: 'POST', body: JSON.stringify(entry) }),
    delete: (id) => apiFetch(`/api/journals/${id}`, { method: 'DELETE' }),
  },
  stories: {
    approved: (situation) => apiFetch(`/api/stories/approved${situation ? `?situation=${encodeURIComponent(situation)}` : ''}`),
    submit: (data) => apiFetch('/api/stories', { method: 'POST', body: JSON.stringify(data) }),
  },
  account: {
    delete: () => apiFetch('/api/account', { method: 'DELETE' }),
  },
  admin: {
    stats: () => apiFetch('/api/admin/stats'),
    moodTrend: () => apiFetch('/api/admin/mood-trend'),
    moodDistribution: () => apiFetch('/api/admin/mood-distribution'),
    submissions: (status) => apiFetch(`/api/admin/submissions?status=${status}`),
    reviewSubmission: (id, status) => apiFetch(`/api/admin/submissions/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    users: () => apiFetch('/api/admin/users'),
  },
};
