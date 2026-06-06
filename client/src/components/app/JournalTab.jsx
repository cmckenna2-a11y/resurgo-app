import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { getFaithContent } from '../../data/faithContent';

const CRISIS_WORDS = ['suicide', 'kill myself', 'end my life', 'want to die', 'hurt myself', 'self harm', 'no reason to live', "can't go on", 'cant go on', 'hopeless', 'give up on life'];

function getPrompts(cat, faithContent) {
  const prompts = {
    general: [
      { text: "What's one thing weighing on you right now, and what's one small step you could take?", tip: 'Focus on feelings, not just facts' },
      { text: "What would you tell a close friend going through what you're going through?", tip: 'Self-compassion exercise' },
      { text: 'What am I avoiding right now, and why?', tip: 'Honest self-check' },
      faithContent.journalExtra,
    ],
    athlete: [
      { text: "After my last game/practice, what am I proud of — even one small thing?", tip: 'Find the positive first' },
      { text: "What story am I telling myself about my performance? Is it true?", tip: 'Challenge negative self-talk' },
      { text: 'How do I want to show up in my next game — in my body, attitude, focus?', tip: 'Pre-game intention' },
      { text: 'What would my most confident self do differently right now?', tip: 'Performance mindset' },
    ],
    stress: [
      { text: "On a scale of 1–10, how stressed am I — and what specifically is driving it?", tip: 'Name it to tame it' },
      { text: "What is actually in my control right now, and what isn't?", tip: "Separate what you can and can't change" },
      { text: 'What does my stress feel like in my body, and what does it need?', tip: 'Body-mind connection' },
      { text: 'If this situation were resolved, what would that look and feel like?', tip: 'Visualize relief' },
    ],
    gratitude: [
      { text: 'Name three specific things from today — however small — that went okay or felt good.', tip: 'Specificity matters more than size' },
      { text: 'Who has helped me recently, and what would I want them to know?', tip: 'Relational gratitude' },
      { text: 'What is something about my body or health I take for granted?', tip: 'Athlete edition' },
      { text: 'What challenge am I facing that might make me stronger looking back?', tip: 'Growth mindset' },
    ],
  };
  return prompts[cat] || prompts.general;
}

export default function JournalTab() {
  const { profile } = useAuth();
  const [cat, setCat] = useState('general');
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [entryText, setEntryText] = useState('');
  const [closerText, setCloserText] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [crisisDetected, setCrisisDetected] = useState(false);

  const faithContent = getFaithContent(profile?.onboarding);
  const prompts = getPrompts(cat, faithContent);
  const wordCount = entryText.trim().split(/\s+/).filter(Boolean).length;

  function selectCat(c) {
    setCat(c);
    setSelectedPrompt(null);
    setEntryText('');
    setCloserText('');
  }

  async function saveJournal() {
    const lower = entryText.toLowerCase();
    if (CRISIS_WORDS.some(w => lower.includes(w))) {
      setCrisisDetected(true);
      return;
    }

    setSaving(true);
    try {
      await api.journals.save({
        category: cat,
        prompt: prompts[selectedPrompt]?.text,
        content: entryText,
        closer: closerText,
      });
      setSaved(true);
    } catch {
    } finally {
      setSaving(false);
    }
  }

  function reset() {
    setSaved(false);
    setCrisisDetected(false);
    setCat('general');
    setSelectedPrompt(null);
    setEntryText('');
    setCloserText('');
  }

  if (crisisDetected) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>💙</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>We're here with you</div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>If you're going through something difficult, please reach out to someone who can help.</div>
        <a href="tel:988" style={{ display: 'block', padding: '13px 20px', background: 'var(--green-dark)', color: '#fff', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: 15, marginBottom: 10 }}>Call or text 988</a>
        <a href="sms:741741" style={{ display: 'block', padding: '13px 20px', background: 'var(--warm-gray)', color: 'var(--text-primary)', borderRadius: 12, textDecoration: 'none', fontWeight: 600, fontSize: 14, border: '1.5px solid var(--border)', marginBottom: 16 }}>Text HOME to 741741</a>
        <button onClick={() => setCrisisDetected(false)} style={{ fontSize: 13, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Continue writing</button>
      </div>
    );
  }

  if (saved) {
    return (
      <div className="saved-msg">
        <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
        <div className="saved-title">Entry saved</div>
        <div className="saved-sub">Great work showing up for yourself today.<br />Even 5 minutes of reflection makes a difference.</div>
        <button className="again-btn" onClick={reset}>Write another entry</button>
      </div>
    );
  }

  const CATS = [
    { id: 'general', label: 'Daily reflection', cls: 'teal' },
    { id: 'athlete', label: 'Athlete mindset', cls: 'purple2' },
    { id: 'stress', label: 'Stress & anxiety', cls: 'coral' },
    { id: 'gratitude', label: 'Gratitude', cls: 'amber' },
  ];

  return (
    <>
      <div className="section-label">Choose a category</div>
      <div className="cat-row">
        {CATS.map(c => (
          <button key={c.id} className={`cat-btn ${c.cls}${cat === c.id ? ' active' : ''}`} onClick={() => selectCat(c.id)}>{c.label}</button>
        ))}
      </div>

      <div>
        {prompts.map((p, i) => (
          <div key={i} className={`prompt-card${selectedPrompt === i ? ' selected' : ''}`} onClick={() => setSelectedPrompt(i)}>
            <div className="prompt-text">{p.text}</div>
            <div className="prompt-tip">{p.tip}</div>
          </div>
        ))}
      </div>

      {selectedPrompt !== null && (
        <>
          <div className="divider" />
          <div className="section-label">Your entry</div>
          <div style={{ fontSize: 13, color: '#888', marginBottom: 10, fontStyle: 'italic' }}>"{prompts[selectedPrompt]?.text}"</div>
          <textarea className="write-area" id="entry-text" rows={6} placeholder="Write freely — no grammar, no rules, just you..." value={entryText} onChange={e => setEntryText(e.target.value)} />
          <div className="char-count">{wordCount} word{wordCount !== 1 ? 's' : ''}</div>
          <div className="closer-box">
            <div className="closer-label">To finish strong:</div>
            One thing I'm grateful for or a small win from today...
          </div>
          <textarea className="write-area" rows={2} placeholder="Even something tiny counts..." value={closerText} onChange={e => setCloserText(e.target.value)} />
          <button className="btn-full primary" onClick={saveJournal} disabled={saving || !entryText.trim()}>
            {saving ? 'Saving...' : 'Save entry'}
          </button>
        </>
      )}
    </>
  );
}
