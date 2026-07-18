import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const STEPS = [
  {
    id: 'struggle', emoji: '💭', title: 'What brings you to Resurgo?', sub: 'We will personalize your experience around this.', type: 'single',
    options: ['Academic stress & burnout', 'Anxiety & overwhelming thoughts', 'Performance & confidence', 'Injury & recovery', 'Just need a space to decompress'],
  },
  {
    id: 'faith', emoji: '🙏', title: 'Does faith or spirituality play a role in your wellbeing?', sub: 'This helps us personalize your guidance and language.', type: 'single',
    options: ['Christianity', 'Islam', 'Judaism', 'Hinduism', 'Buddhism', 'Spiritual but not religious', 'Not really', 'Prefer not to say'],
  },
  {
    id: 'injury', emoji: '🏥', title: 'Are you currently competing or recovering?', sub: 'You can change this anytime in the app.', type: 'single', athleteOnly: true,
    options: ['Healthy & competing', 'Recovering from injury'],
  },
  {
    id: 'college', emoji: '🏫', title: 'Where do you go to school?', sub: 'We will connect you to your school mental health resources.', type: 'single',
    options: ['Bates College', 'Other (not listed yet)'],
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useAuth();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const isAthlete = profile?.role === 'athlete';
  const steps = STEPS.filter(s => !s.athleteOnly || isAthlete);
  const current = steps[step];
  const total = steps.length;
  const pct = Math.round((step / total) * 100);
  const selected = answers[current?.id] || [];

  function toggle(opt) {
    const key = current.id;
    if (current.type === 'single') {
      setAnswers(a => ({ ...a, [key]: [opt] }));
    } else {
      setAnswers(a => {
        const prev = a[key] || [];
        return { ...a, [key]: prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt] };
      });
    }
  }

  const [saving, setSaving] = useState(false);

  async function next() {
    if (step < steps.length - 1) {
      setStep(s => s + 1);
      return;
    }
    // Final step: save, but never let a hung/failed save trap the user.
    setSaving(true);
    const school = answers.college?.[0] === 'Bates College' ? 'Bates College' : null;
    try {
      await Promise.race([
        updateProfile({ onboarding: answers, school }),
        new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 5000)),
      ]);
    } catch {
      // Save will retry in the background via context; still let them in.
    }
    navigate('/', { replace: true });
  }

  async function skip() {
    // Mark onboarding as skipped — without this, App.jsx sees no 'struggle'
    // answer and bounces the user right back here. Wait for the profile
    // state to update (capped) so the redirect gate sees the new value.
    try {
      await Promise.race([
        updateProfile({ onboarding: { ...answers, skipped: true } }),
        new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 5000)),
      ]);
    } catch {}
    navigate('/', { replace: true });
  }

  if (!current) return null;

  return (
    <div className="phone">
      <div className="auth-screen">
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: '#aaa' }}>{step + 1} of {total}</span>
            <button onClick={skip} style={{ fontSize: 12, color: '#aaa', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Skip</button>
          </div>
          <div style={{ height: 4, background: '#f0f0ec', borderRadius: 2 }}>
            <div style={{ height: 4, background: '#1D9E75', borderRadius: 2, width: `${pct}%`, transition: 'width 0.3s' }} />
          </div>
        </div>

        <div style={{ fontSize: 36, marginBottom: 12 }}>{current.emoji}</div>
        <div className="auth-title" style={{ marginBottom: 4 }}>{current.title}</div>
        <div className="auth-sub" style={{ marginBottom: '1.5rem' }}>{current.sub}</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: '1.5rem' }}>
          {current.options.map(opt => (
            <button key={opt} className={`ob-opt${selected.includes(opt) ? ' ob-selected' : ''}`} onClick={() => toggle(opt)}>
              <span>{opt}</span>
              <span className="ob-check" style={{ opacity: selected.includes(opt) ? 1 : 0 }}>✓</span>
            </button>
          ))}
        </div>

        <button className="auth-btn" onClick={next} disabled={selected.length === 0}>
          {step === total - 1 ? 'Finish setup' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
