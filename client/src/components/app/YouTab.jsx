import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';

function getInitials(name = '') {
  return name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

const PREF_META = {
  struggle: { title: 'What brings you to Resurgo?', sub: 'We personalize your experience around this.', type: 'single', options: ['Academic stress & burnout', 'Anxiety & overwhelming thoughts', 'Performance & confidence', 'Injury & recovery', 'Just need a space to decompress'] },
  timing: { title: 'When do you need support most?', sub: 'Pick everything that applies.', type: 'multi', options: ['Before exams or competitions', 'During stressful weeks', 'After a bad day', 'All the time honestly'] },
  goal: { title: 'Your goal', sub: 'Your goal shapes what we recommend.', type: 'single', options: ['Sleep better', 'Perform better', 'Feel less anxious', 'Be more confident', 'Process my emotions'] },
  time: { title: 'Time available daily', sub: "We'll match tools to your schedule.", type: 'single', options: ['2 minutes', '5 minutes', '10+ minutes'] },
  faith: { title: 'Faith & spirituality', sub: 'This personalizes your guidance and language.', type: 'single', options: ['Christianity', 'Islam', 'Judaism', 'Hinduism', 'Buddhism', 'Spiritual but not religious', 'Not really', 'Prefer not to say'] },
  injury: { title: 'Competing or recovering?', sub: 'You can change this anytime.', type: 'single', options: ['Healthy & competing', 'Recovering from injury'] },
  college: { title: 'Your school', sub: 'We connect you to your campus resources.', type: 'single', options: ['Bates College', 'Other (not listed yet)'] },
};

const MOOD_LABELS = { 1: 'Rough', 2: 'Meh', 3: 'Okay', 4: 'Good', 5: 'Great' };
const MOOD_COLORS = { 1: '#F09595', 2: '#FAC775', 3: '#B5D4F4', 4: '#9FE1CB', 5: '#5DCAA5' };

function MoodHistoryChart({ history }) {
  if (!history.length) {
    return (
      <div style={{ background: '#f9f9f7', borderRadius: 12, padding: 16, textAlign: 'center' }}>
        <div style={{ fontSize: 13, color: '#aaa', lineHeight: 1.6 }}>No check-ins yet.<br />Start by selecting your mood on the home screen each day.</div>
      </div>
    );
  }

  const days = 30;
  const today = new Date();
  const slots = Array.from({ length: days }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (days - 1 - i));
    const dateStr = d.toISOString().split('T')[0];
    const entry = history.find(e => e.date === dateStr);
    return { date: dateStr, mood: entry?.mood ?? null, dayNum: d.getDate() };
  });

  const filled = slots.filter(s => s.mood !== null);
  const avg = filled.length ? (filled.reduce((a, s) => a + s.mood, 0) / filled.length).toFixed(1) : null;

  let streak = 0;
  for (let i = slots.length - 1; i >= 0; i--) {
    if (slots[i].mood !== null) streak++;
    else break;
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
        {avg && (
          <div style={{ flex: 1, background: 'var(--green-pale)', borderRadius: 10, padding: '10px 12px' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--green-dark)' }}>{avg}</div>
            <div style={{ fontSize: 11, color: 'var(--green-dark)' }}>avg mood / 30 days</div>
          </div>
        )}
        {streak > 0 && (
          <div style={{ flex: 1, background: 'var(--green-pale)', borderRadius: 10, padding: '10px 12px' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--green-dark)' }}>{streak}</div>
            <div style={{ fontSize: 11, color: 'var(--green-dark)' }}>day streak</div>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
        {slots.slice(-14).map((s, i) => (
          <div key={i} title={s.mood ? `${s.date}: ${MOOD_LABELS[s.mood]}` : s.date}
            style={{ height: 32, borderRadius: 6, background: s.mood ? MOOD_COLORS[s.mood] : 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: s.mood ? '#fff' : '#ccc', fontWeight: 600 }}>
            {s.dayNum}
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: '#aaa', textAlign: 'center' }}>Last 14 days</div>
    </div>
  );
}

function PrefEditor({ prefKey, onClose, onSave }) {
  const { profile } = useAuth();
  const meta = PREF_META[prefKey];
  const [selected, setSelected] = useState(profile?.onboarding?.[prefKey] || []);

  function toggle(opt) {
    if (meta.type === 'single') {
      setSelected([opt]);
    } else {
      setSelected(s => s.includes(opt) ? s.filter(x => x !== opt) : [...s, opt]);
    }
  }

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#fff', borderRadius: 24, zIndex: 10, overflowY: 'auto' }}>
      <div style={{ padding: 20 }}>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', marginBottom: '1.5rem' }}>← Back to settings</button>
        <div className="auth-title" style={{ marginBottom: 6 }}>{meta.title}</div>
        <div className="auth-sub" style={{ marginBottom: '1.5rem' }}>{meta.sub}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: '1.5rem' }}>
          {meta.options.map(opt => (
            <button key={opt} className={`ob-opt${selected.includes(opt) ? ' ob-selected' : ''}`} onClick={() => toggle(opt)}>
              <span>{opt}</span>
              <span className="ob-check" style={{ opacity: selected.includes(opt) ? 1 : 0 }}>✓</span>
            </button>
          ))}
        </div>
        <button className="auth-btn" onClick={() => onSave(prefKey, selected)} disabled={!selected.length}>Save changes</button>
      </div>
    </div>
  );
}

const LEGAL_SECTIONS = {
  privacy: {
    title: 'Privacy Policy', updated: 'Last updated: April 2026',
    items: [
      { title: 'Who we are', body: 'Resurgo is a student wellness app. We are not a healthcare provider, therapist, or clinical service.' },
      { title: 'What data we collect', body: 'We collect your name, email address, and password when you create an account. We collect your mood check-ins, journal entries, onboarding answers, and any stories you submit. We do not collect your location, contacts, camera, or microphone.' },
      { title: 'How we store your data', body: 'Your data is stored securely in Supabase, encrypted in transit and at rest.' },
      { title: 'What we do not do', body: 'We do not sell your data. We do not share your data with advertisers. We do not use your data to train AI models.' },
      { title: 'Your rights', body: 'You can update your personal information in the You tab at any time. You can delete your account and all associated data at any time.' },
      { title: 'Minimum age', body: 'Resurgo is intended for users who are 18 years of age or older.' },
      { title: 'Crisis disclaimer', body: 'Resurgo is not a crisis service. If you are experiencing a mental health emergency, please contact the 988 Suicide and Crisis Lifeline.' },
    ],
  },
  terms: {
    title: 'Terms of Service', updated: 'Last updated: April 2026',
    items: [
      { title: 'Acceptance of terms', body: 'By creating an account and using Resurgo, you agree to these Terms of Service.' },
      { title: 'Not a medical service', body: 'Resurgo is a wellness tool, not a medical or mental health service. Nothing in Resurgo constitutes medical advice, diagnosis, or treatment.' },
      { title: 'Not a crisis service', body: 'Resurgo is not equipped to handle mental health emergencies. If you are in crisis, please contact 988 or your local emergency services immediately.' },
      { title: 'Your account', body: 'You are responsible for keeping your login credentials secure. You must be at least 18 years old to create an account.' },
      { title: 'User-submitted content', body: 'When you submit a story to Resurgo, you grant us the right to display that story anonymously to other users.' },
      { title: 'Limitation of liability', body: 'Resurgo is provided as-is. We are not liable for any harm that results from your use of the app.' },
    ],
  },
};

export default function YouTab({ active }) {
  const { profile, updateProfile, logout, deleteAccount } = useAuth();
  const [moodHistory, setMoodHistory] = useState([]);
  const [editingPref, setEditingPref] = useState(null);
  const [showLegal, setShowLegal] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchHistory = useCallback(async () => {
    try {
      const data = await api.moods.list();
      setMoodHistory(data || []);
    } catch {}
  }, []);

  useEffect(() => {
    if (active) fetchHistory();
  }, [active, fetchHistory]);

  const initials = getInitials(profile?.name);
  const isAthlete = profile?.role === 'athlete';
  const ob = profile?.onboarding || {};

  async function toggleRole() {
    const newRole = isAthlete ? 'student' : 'athlete';
    await updateProfile({ role: newRole });
  }

  async function savePref(key, val) {
    const newOb = { ...ob, [key]: val };
    const school = key === 'college' ? (val[0] === 'Bates College' ? 'Bates College' : null) : profile?.school;
    await updateProfile({ onboarding: newOb, school });
    setEditingPref(null);
  }

  async function handleDelete() {
    setDeleting(true);
    await deleteAccount();
  }

  const prefRows = [
    { key: 'struggle', label: 'What brings you to Resurgo?' },
    { key: 'timing', label: 'When do you need support most?' },
    { key: 'goal', label: 'Your goal' },
    { key: 'time', label: 'Time available daily' },
    { key: 'faith', label: 'Faith & spirituality' },
    ...(isAthlete ? [{ key: 'injury', label: 'Competing or recovering?' }] : []),
    { key: 'college', label: 'Your school' },
  ];

  return (
    <div style={{ position: 'relative' }}>
      {editingPref && <PrefEditor prefKey={editingPref} onClose={() => setEditingPref(null)} onSave={savePref} />}

      {showLegal && (
        <div style={{ position: 'absolute', inset: 0, background: '#fff', borderRadius: 24, zIndex: 20, overflowY: 'auto', padding: 20 }}>
          <button onClick={() => setShowLegal(null)} style={{ background: 'none', border: 'none', color: '#888', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', marginBottom: '1.5rem' }}>← Back</button>
          <div style={{ fontSize: 20, fontWeight: 600, color: '#1a1a1a', marginBottom: 4 }}>{LEGAL_SECTIONS[showLegal].title}</div>
          <div style={{ fontSize: 12, color: '#aaa', marginBottom: 20 }}>{LEGAL_SECTIONS[showLegal].updated}</div>
          {LEGAL_SECTIONS[showLegal].items.map((item, i) => (
            <div key={i} style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 6 }}>{i + 1}. {item.title}</div>
              <div style={{ fontSize: 13, color: '#555', lineHeight: 1.7 }}>{item.body}</div>
            </div>
          ))}
        </div>
      )}

      {showDelete && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', borderRadius: 24, zIndex: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, width: '100%' }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#1a1a1a', marginBottom: 8 }}>Delete your account?</div>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 20, lineHeight: 1.6 }}>This will permanently delete your account, mood history, journal entries, and all saved data. This cannot be undone.</div>
            <button onClick={handleDelete} disabled={deleting} style={{ width: '100%', padding: 12, borderRadius: 10, border: 'none', background: '#A32D2D', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 10 }}>{deleting ? 'Deleting...' : 'Yes, delete everything'}</button>
            <button onClick={() => setShowDelete(false)} style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid #e5e5e0', background: 'none', color: '#888', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
          </div>
        </div>
      )}

      <div className="section-label">Your profile</div>
      <div className="profile-card">
        <div className="profile-avatar-big">{initials}</div>
        <div>
          <div className="profile-name">{profile?.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <div className="profile-role">{isAthlete ? 'Student athlete' : 'Student'}</div>
            <button onClick={toggleRole} style={{ fontSize: 11, color: 'var(--green-dark)', background: 'var(--green-pale)', border: '1px solid var(--green-light)', borderRadius: 20, padding: '2px 10px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>Switch</button>
          </div>
          <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>{profile?.email}</div>
        </div>
      </div>

      <div className="section-label">Mood history</div>
      <MoodHistoryChart history={moodHistory} />

      <div className="divider" />
      <div className="section-label">Settings & preferences</div>
      <div style={{ fontSize: 13, color: '#888', marginBottom: 14 }}>Your answers shape everything in the app. Update them anytime.</div>

      {prefRows.map(row => (
        <div key={row.key} className="pref-row" onClick={() => setEditingPref(row.key)}>
          <div className="pref-left">
            <div className="pref-title">{row.label}</div>
            <div className="pref-val" style={{ color: ob[row.key]?.length ? 'var(--green-dark)' : '#aaa' }}>
              {ob[row.key]?.length ? ob[row.key].join(', ') : 'Not set — tap to update'}
            </div>
          </div>
          <div className="pref-arrow">›</div>
        </div>
      ))}

      <div className="divider" />
      <div className="section-label">Account</div>
      <div className="pref-row" onClick={() => setShowLegal('privacy')}>
        <div className="pref-left"><div className="pref-title">Privacy Policy</div><div className="pref-val" style={{ color: '#888' }}>How we handle your data</div></div>
        <div className="pref-arrow">›</div>
      </div>
      <div className="pref-row" onClick={() => setShowLegal('terms')}>
        <div className="pref-left"><div className="pref-title">Terms of Service</div><div className="pref-val" style={{ color: '#888' }}>Rules for using Resurgo</div></div>
        <div className="pref-arrow">›</div>
      </div>

      <div style={{ marginTop: 12, marginBottom: 4 }}>
        <button onClick={() => setShowDelete(true)} style={{ width: '100%', padding: 11, borderRadius: 10, border: '1px solid #e5e5e0', background: 'none', color: '#888', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Delete my account</button>
      </div>
      <button className="logout-btn" onClick={logout}>Sign out</button>

      <div style={{ textAlign: 'center', marginTop: 16, fontSize: 11, color: '#ccc', lineHeight: 1.8 }}>
        Resurgo is a wellness tool, not a clinical service.<br />
        If you are in crisis, please contact 988.<br />
        © 2026 Resurgo. All rights reserved.
      </div>
    </div>
  );
}
