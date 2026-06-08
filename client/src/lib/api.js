import { supabase } from './supabase';

async function authHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
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

export const api = {
  moods: {
    list: () => apiFetch('/api/moods'),
    save: (mood, date) => apiFetch('/api/moods', { method: 'POST', body: JSON.stringify({ mood, date }) }),
  },
  journals: {
    list: () => apiFetch('/api/journals'),
    save: (entry) => apiFetch('/api/journals', { method: 'POST', body: JSON.stringify(entry) }),
    delete: (id) => apiFetch(`/api/journals/${id}`, { method: 'DELETE' }),
  },
  stories: {
    approved: (situation) => apiFetch(`/api/stories/approved${situation ? `?situation=${situation}` : ''}`),
    submit: (data) => apiFetch('/api/stories', { method: 'POST', body: JSON.stringify(data) }),
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
