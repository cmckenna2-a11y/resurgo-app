import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const STUDENT_QUESTIONS = [
  'How often do you feel mentally exhausted after a normal day?',
  'How often do you feel like your schoolwork is pointless or meaningless?',
  'How often do you feel emotionally drained at the end of the week?',
  'How often do you struggle to find motivation to do things you used to enjoy?',
  'How often do you feel overwhelmed by your responsibilities?',
  'How often do you feel like you are falling behind no matter how hard you try?',
];

const ATHLETE_QUESTIONS = [
  'How often do you feel physically and mentally exhausted after practice?',
  'How often do you feel like your sport has lost its meaning or purpose?',
  'How often do you dread going to practice or competing?',
  'How often do you struggle to recover emotionally after a bad game or practice?',
  'How often do you feel overwhelmed by the demands of being a student athlete?',
  'How often do you feel like no matter how hard you train, it is never enough?',
];

const LABELS = ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'];

export default function Burnout() {
  const { profile } = useAuth();
  const isAthlete = profile?.role === 'athlete';
  const questions = isAthlete ? ATHLETE_QUESTIONS : STUDENT_QUESTIONS;

  const [answers, setAnswers] = useState(Array(6).fill(null));
  const [done, setDone] = useState(false);

  function answer(qi, val) {
    const next = [...answers];
    next[qi] = val;
    setAnswers(next);
  }

  const allAnswered = answers.every(a => a !== null);

  const score = allAnswered
    ? Math.round((answers.reduce((s, a) => s + a, 0) / (6 * 4)) * 100)
    : 0;

  function getResult(pct) {
    if (pct <= 40) return {
      label: 'Doing well',
      color: '#1D9E75',
      bg: '#E1F5EE',
      textColor: '#085041',
      icon: '🟢',
      body: 'Your burnout indicators are low. Keep doing what you\'re doing — rest, routine, and balance are working.',
      tips: [
        'Keep protecting your sleep and your recovery time.',
        'Check in with yourself weekly — catching burnout early is key.',
        'Notice what is working and make it a habit, not a coincidence.',
      ],
    };
    if (pct <= 65) return {
      label: 'Early warning signs',
      color: '#D68B2E',
      bg: '#FEF3E2',
      textColor: '#7A4F10',
      icon: '🟡',
      body: 'You\'re showing early signs of burnout. This is the most important time to act — before it compounds.',
      tips: [
        'Identify the one thing draining you most right now. Can you reduce it?',
        'Build in at least one real rest day this week — not just less work, actual rest.',
        'Talk to someone you trust about how you\'re feeling.',
        'Use the breathing or study break tools in this app consistently.',
      ],
    };
    return {
      label: 'High burnout risk',
      color: '#A32D2D',
      bg: '#FCEBEB',
      textColor: '#7A1F1F',
      icon: '🔴',
      body: 'You\'re showing significant burnout indicators. This deserves serious attention — burnout doesn\'t fix itself.',
      tips: [
        'Talk to a counselor or trusted adult this week. This is important.',
        'Identify what you can temporarily drop or reduce — not everything is truly urgent.',
        'Your performance will not improve until you recover. Rest is not optional.',
        'Call your campus counseling center and make an appointment today.',
        'If you are overwhelmed, text or call 988.',
      ],
    };
  }

  if (done) {
    const result = getResult(score);
    return (
      <>
        <div className="section-label">Your burnout check-in</div>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>{result.icon}</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: result.color, marginBottom: 4 }}>{result.label}</div>
          <div style={{ fontSize: 13, color: '#888' }}>Score: {score}%</div>
        </div>

        <div style={{ background: result.bg, borderRadius: 12, padding: '14px 16px', marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: result.textColor, lineHeight: 1.7 }}>{result.body}</div>
        </div>

        <div className="section-label">What to do</div>
        {result.tips.map((tip, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: result.color, flexShrink: 0, marginTop: 6 }} />
            <div style={{ fontSize: 13, color: '#333', lineHeight: 1.7 }}>{tip}</div>
          </div>
        ))}

        <button className="btn-full" style={{ marginTop: 16 }} onClick={() => { setAnswers(Array(6).fill(null)); setDone(false); }}>Take it again</button>
      </>
    );
  }

  return (
    <>
      <div className="section-label">Burnout check-in</div>
      <div style={{ background: '#f9f9f7', border: '0.5px solid #e5e5e0', borderRadius: 12, padding: '12px 14px', marginBottom: 16, fontSize: 13, color: '#555', lineHeight: 1.6 }}>
        Answer honestly — no one else sees this. Rate how often you feel each of the following.
      </div>

      {questions.map((q, qi) => (
        <div key={qi} style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 10, lineHeight: 1.5 }}>{qi + 1}. {q}</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {LABELS.map((lbl, vi) => (
              <button key={vi} onClick={() => answer(qi, vi)}
                style={{
                  flex: 1, padding: '8px 2px', borderRadius: 8, border: answers[qi] === vi ? '2px solid #1D9E75' : '1px solid #e5e5e0',
                  background: answers[qi] === vi ? '#E1F5EE' : '#fff',
                  color: answers[qi] === vi ? '#085041' : '#555',
                  fontSize: 10, fontWeight: answers[qi] === vi ? 700 : 400, cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.15s',
                }}>
                {lbl}
              </button>
            ))}
          </div>
        </div>
      ))}

      <button className={`btn-full${allAnswered ? ' primary' : ''}`} disabled={!allAnswered} onClick={() => setDone(true)}>
        See my results
      </button>
    </>
  );
}
