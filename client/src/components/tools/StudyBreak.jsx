import { useState, useRef, useEffect } from 'react';

const BREAK_ACTIVITIES = [
  { title: 'Box breathing reset', desc: 'Breathe in 4 counts, hold 4, out 4, hold 4. Repeat 4 times. Resets your nervous system in under 2 minutes.' },
  { title: 'Stand up and stretch', desc: 'Roll your shoulders back, reach your arms overhead, touch your toes. Sitting compresses your spine and reduces blood flow to your brain.' },
  { title: 'Look out a window for 2 minutes', desc: 'Your eyes have been focused at close range for 45 minutes. Looking at a distant point relaxes your eye muscles and reduces tension headaches.' },
  { title: 'Drink a full glass of water', desc: 'Dehydration — even mild — reduces cognitive performance. Most students are mildly dehydrated without knowing it. Drink a full glass right now.' },
  { title: 'Walk around for 5 minutes', desc: 'Even a short walk increases blood flow to your brain, improves mood, and helps consolidate what you just studied.' },
  { title: 'Write one thing you just learned', desc: 'Take 2 minutes to write out one concept you just studied in your own words. Retrieval practice like this is one of the most effective study techniques that exists.' },
  { title: 'Close your eyes and do nothing', desc: 'No phone, no music, no input. Just sit quietly for 3 minutes. Your default mode network needs downtime to work.' },
];

function fmt(s) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export default function StudyBreak() {
  const STUDY_SECS = 45 * 60;
  const BREAK_SECS = 5 * 60;

  const [mode, setMode] = useState('study');
  const [left, setLeft] = useState(STUDY_SECS);
  const [running, setRunning] = useState(false);
  const [actIdx, setActIdx] = useState(() => Math.floor(Math.random() * BREAK_ACTIVITIES.length));
  const timerRef = useRef(null);
  const leftRef = useRef(STUDY_SECS);
  const modeRef = useRef('study');

  function tick() {
    leftRef.current--;
    setLeft(leftRef.current);
    if (leftRef.current <= 0) {
      clearInterval(timerRef.current);
      const nextMode = modeRef.current === 'study' ? 'break' : 'study';
      const nextSecs = nextMode === 'study' ? STUDY_SECS : BREAK_SECS;
      modeRef.current = nextMode;
      leftRef.current = nextSecs;
      setMode(nextMode);
      setLeft(nextSecs);
      setRunning(false);
      if (nextMode === 'break') setActIdx(Math.floor(Math.random() * BREAK_ACTIVITIES.length));
    }
  }

  function toggle() {
    if (running) {
      clearInterval(timerRef.current);
      setRunning(false);
    } else {
      setRunning(true);
      timerRef.current = setInterval(tick, 1000);
    }
  }

  function reset() {
    clearInterval(timerRef.current);
    modeRef.current = 'study';
    leftRef.current = STUDY_SECS;
    setMode('study');
    setLeft(STUDY_SECS);
    setRunning(false);
  }

  useEffect(() => () => clearInterval(timerRef.current), []);

  const activity = BREAK_ACTIVITIES[actIdx];
  const color = mode === 'study' ? '#1D9E75' : '#534AB7';

  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>
          {mode === 'study' ? '📚 Study session' : '☕ Break time'}
        </div>
        <div className="break-circle" style={{ borderColor: color }}>
          <div className="break-time">{fmt(left)}</div>
          <div className="break-label">{mode === 'study' ? 'focus' : 'rest'}</div>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button className={`btn${running ? '' : ' primary'}`} onClick={toggle}>
            {running ? 'Pause' : left < (mode === 'study' ? STUDY_SECS : BREAK_SECS) ? 'Resume' : 'Start'}
          </button>
          <button className="btn" onClick={reset}>Reset</button>
        </div>
      </div>

      <div style={{ background: '#f9f9f7', borderRadius: 12, padding: '12px 14px', marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>How it works</div>
        <div style={{ fontSize: 13, color: '#555', lineHeight: 1.6 }}>Study for <strong>45 minutes</strong>, take a <strong>5 minute break</strong>. Repeat. Based on the Pomodoro technique — one of the most research-backed study methods for focus and retention.</div>
      </div>

      <div style={{ fontSize: 11, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>For your next break</div>
      <div className="break-activity">
        <div className="break-activity-title">{activity.title}</div>
        <div className="break-activity-desc">{activity.desc}</div>
      </div>
      <button style={{ fontSize: 12, color: '#534AB7', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline' }} onClick={() => setActIdx(i => (i + 1) % BREAK_ACTIVITIES.length)}>
        Different suggestion
      </button>
    </>
  );
}
