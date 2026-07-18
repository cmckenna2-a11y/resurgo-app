import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { localDateStr } from '../../lib/dates';
import { COLLEGE_RESOURCES } from '../../data/collegeResources';

const MOODS = [
  { emoji: '😔', label: 'rough', value: 1 },
  { emoji: '😐', label: 'meh', value: 2 },
  { emoji: '🙂', label: 'okay', value: 3 },
  { emoji: '😊', label: 'good', value: 4 },
  { emoji: '😁', label: 'great', value: 5 },
];

function CrisisOverlay({ onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: '28px 24px', maxWidth: 380, width: '100%' }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#1C1C1A', marginBottom: 8 }}>We noticed you've been struggling.</div>
        <div style={{ fontSize: 14, color: '#5C5C58', lineHeight: 1.7, marginBottom: 20 }}>Resurgo is a wellness tool — not a substitute for professional support. If you are going through a difficult time, please reach out to someone who can help.</div>
        <div style={{ background: '#EEF8F3', borderRadius: 12, padding: 14, marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1A7A5E', marginBottom: 10 }}>Get support now</div>
          <a href="tel:988" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, background: '#fff', borderRadius: 10, marginBottom: 8, textDecoration: 'none', border: '1px solid #D6EFE6' }}>
            <span style={{ fontSize: 20 }}>📞</span>
            <div><div style={{ fontSize: 13, fontWeight: 700, color: '#1C1C1A' }}>988 Crisis Lifeline</div><div style={{ fontSize: 11, color: '#5C5C58' }}>Call or text 988 — available 24/7</div></div>
          </a>
        </div>
        <button onClick={onClose} style={{ width: '100%', padding: 13, borderRadius: 12, border: '1.5px solid #E8E4DD', background: 'none', color: '#5C5C58', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>I'm okay for now</button>
      </div>
    </div>
  );
}

export default function HomeTab({ active, onNavigate }) {
  const { profile } = useAuth();
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);
  const [showCrisis, setShowCrisis] = useState(false);
  const isAthlete = profile?.role === 'athlete';
  const school = COLLEGE_RESOURCES[profile?.school];

  const fetchHistory = useCallback(async () => {
    try {
      const data = await api.moods.list();
      setMoodHistory(data || []);
    } catch {}
  }, []);

  useEffect(() => {
    if (active) fetchHistory();
  }, [active, fetchHistory]);

  // Re-fetch when the app comes back to the foreground (e.g. opened the next
  // morning after iOS suspended it). Without this, `today` is still yesterday's
  // date and the mood history is stale until the user manually navigates away
  // and back.
  useEffect(() => {
    function onVisible() {
      if (document.visibilityState === 'visible' && active) fetchHistory();
    }
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [active, fetchHistory]);

  // Check today's mood
  useEffect(() => {
    const today = localDateStr();
    const todayEntry = moodHistory.find(e => e.date === today);
    if (todayEntry) setSelectedMood(todayEntry.mood);
  }, [moodHistory]);

  async function selectMood(value) {
    setSelectedMood(value);
    const today = localDateStr();
    // Optimistic update — reflect the tap immediately without waiting for the
    // save round-trip, then fire-and-forget the network write.
    const next = [{ mood: value, date: today }, ...moodHistory.filter(e => e.date !== today)];
    setMoodHistory(next);
    // Crisis detection runs on the local state so we need no second API call.
    // Trigger on 3 consecutive CALENDAR DAYS at "rough" ending today — not
    // just the last 3 entries, which could be spread weeks apart.
    const byDate = new Map(next.map(e => [e.date, e.mood]));
    let roughStreak = 0;
    for (let i = 0; i < 3; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      if (byDate.get(localDateStr(d)) === 1) roughStreak++;
      else break;
    }
    if (roughStreak >= 3) setTimeout(() => setShowCrisis(true), 400);
    try {
      await api.moods.save(value, today);
    } catch {}
  }

  const { streak, checkedInToday, smartCards } = useMemo(() => {
    const today = localDateStr();
    let streak = 0;
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = localDateStr(d);
      if (moodHistory.find(e => e.date === ds)) streak++;
      else break;
    }
    const checkedInToday = !!moodHistory.find(e => e.date === today);
    const recent = moodHistory.slice(0, 3).map(e => e.mood);
    const lowMoods = recent.filter(m => m <= 2).length;
    const highMoods = recent.filter(m => m >= 4).length;

    const smartCards = [];
    if (lowMoods >= 2) {
      smartCards.push({ title: '4-7-8 breathing', badge: '3 min', sub: 'Calm your nervous system right now', action: () => onNavigate('tools') });
      smartCards.push({ title: 'Guided journal', badge: 'Reflect', badgeCls: '', sub: "Writing helps process what you're carrying", action: () => onNavigate('journal') });
      smartCards.push({ title: 'Peer support', badge: 'Connect', badgeCls: 'purple', sub: 'Read stories from people who get it', action: () => onNavigate('connect') });
    } else if (highMoods >= 2 || streak >= 5) {
      if (isAthlete) smartCards.push({ title: 'Pre-game mental prep', badge: 'Athlete', badgeCls: 'purple', sub: 'Faith-personalized 6-step routine', action: () => onNavigate('tools') });
      else smartCards.push({ title: 'Exam anxiety toolkit', badge: 'Student', badgeCls: '', sub: 'Step-by-step guide for every exam phase', action: () => onNavigate('tools') });
      smartCards.push({ title: 'Guided journal', badge: 'Reflect', badgeCls: '', sub: 'Prompts personalized to you', action: () => onNavigate('journal') });
    } else {
      smartCards.push({ title: '4-7-8 breathing', badge: '3 min', badgeCls: '', sub: 'Calm your nervous system instantly', action: () => onNavigate('tools') });
      smartCards.push({ title: 'Peer support', badge: 'Connect', badgeCls: 'purple', sub: 'Read stories from people who get it', action: () => onNavigate('connect') });
      smartCards.push({ title: 'Guided journal', badge: 'Reflect', badgeCls: '', sub: 'Prompts personalized to you', action: () => onNavigate('journal') });
    }
    return { streak, checkedInToday, smartCards };
  }, [moodHistory, isAthlete, onNavigate]);

  return (
    <>
      {showCrisis && <CrisisOverlay onClose={() => setShowCrisis(false)} />}

      {isAthlete && (
        <div className="mode-toggle">
          <button className="mode-btn active-mode">Competing</button>
          <button className="mode-btn" onClick={() => onNavigate('tools')}>In recovery</button>
        </div>
      )}

      <div className="section-label">How are you feeling?</div>
      <div className="mood-grid">
        {MOODS.map(m => (
          <button key={m.value} className={`mood-btn${selectedMood === m.value ? ' selected' : ''}`} onClick={() => selectMood(m.value)}>
            <span className="mood-emoji">{m.emoji}</span>
            {m.label}
          </button>
        ))}
      </div>

      {checkedInToday && streak > 0 && (
        <div className="streak-wrap">
          <div className="streak-label">{streak}-day check-in streak</div>
          <div className="streak-dots">
            {Array.from({ length: Math.min(streak, 7) }, (_, i) => (
              <div key={i} className="streak-dot" />
            ))}
            {Array.from({ length: Math.max(0, 7 - streak) }, (_, i) => (
              <div key={`e${i}`} className="streak-dot empty" />
            ))}
          </div>
        </div>
      )}

      {!checkedInToday && (
        <div style={{ background: 'var(--amber-bg)', borderRadius: 14, padding: '14px 16px', marginBottom: 12, borderLeft: '4px solid #C4900A' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--amber-text)', marginBottom: 3 }}>Check in today</div>
          <div style={{ fontSize: 12, color: 'var(--amber-text)', opacity: 0.85 }}>You haven't checked in yet. How are you feeling?</div>
        </div>
      )}

      <div className="section-label" style={{ marginTop: 16 }}>Jump back in</div>
      {smartCards.map((card, i) => (
        <div key={i} className="card" onClick={card.action}>
          <div className="card-row">
            <div className="card-title">{card.title}</div>
            <span className={`badge${card.badgeCls ? ' ' + card.badgeCls : ''}`}>{card.badge}</span>
          </div>
          <div className="card-sub">{card.sub}</div>
        </div>
      ))}

      <div className="divider" />
      <div className="section-label">Always here</div>
      <a className="resource-card" href="tel:988" style={{ marginBottom: 8 }}>
        <div className="resource-icon" style={{ background: '#FCEBEB' }}>🚨</div>
        <div><div className="resource-title">988 Lifeline</div><div className="resource-sub">Call or text 988 — free, 24/7</div></div>
        <span className="badge red" style={{ marginLeft: 'auto' }}>Urgent</span>
      </a>
      <a className="resource-card" href="sms:741741">
        <div className="resource-icon" style={{ background: '#FCEBEB' }}>💬</div>
        <div><div className="resource-title">Crisis Text Line</div><div className="resource-sub">Text HOME to 741741</div></div>
        <span className="badge red" style={{ marginLeft: 'auto' }}>Urgent</span>
      </a>

      {school && (
        <div style={{ marginTop: 10 }}>
          <div style={{ background: 'var(--warm-gray)', borderLeft: `4px solid ${school.color}`, borderRadius: 12, padding: '12px 14px', marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{school.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Your campus mental health resources</div>
          </div>
          {school.resources.map((r, i) => (
            <a key={i} className="resource-card" href={r.url} target="_blank" rel="noreferrer">
              <div className="resource-icon" style={{ background: 'var(--green-pale)' }}>{r.icon}</div>
              <div style={{ flex: 1 }}><div className="resource-title">{r.title}</div><div className="resource-sub">{r.sub}</div></div>
              <div style={{ fontSize: 18, color: 'var(--text-muted)' }}>›</div>
            </a>
          ))}
        </div>
      )}
    </>
  );
}
