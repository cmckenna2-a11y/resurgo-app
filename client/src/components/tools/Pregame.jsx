import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getFaithContent } from '../../data/faithContent';

const STEPS = [
  { id: 'open', label: 'Open with intention', type: 'read', duration: null },
  { id: 'body', label: 'Body scan', type: 'timer', duration: 120 },
  { id: 'intention', label: 'Set your intention', type: 'write', prompt: 'What do you want to feel like when you walk off the field/court today? Write it in one sentence.' },
  { id: 'affirm', label: 'Affirmation', type: 'affirm', duration: null },
  { id: 'visualize', label: 'Visualization', type: 'timer', duration: 180 },
  { id: 'word', label: 'Power word', type: 'write', prompt: 'Choose one word that will anchor you today. Write it here and say it out loud.' },
];

function fmt(s) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export default function Pregame() {
  const { profile } = useAuth();
  const fc = getFaithContent(profile?.onboarding);

  const [stepIdx, setStepIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [text, setText] = useState('');
  const [affirmIdx, setAffirmIdx] = useState(0);
  const [timerLeft, setTimerLeft] = useState(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef(null);
  const leftRef = useRef(null);

  const step = STEPS[stepIdx];
  const progress = ((stepIdx) / STEPS.length) * 100;

  function startTimer(secs) {
    leftRef.current = secs;
    setTimerLeft(secs);
    setTimerRunning(true);
    timerRef.current = setInterval(() => {
      leftRef.current--;
      setTimerLeft(leftRef.current);
      if (leftRef.current <= 0) {
        clearInterval(timerRef.current);
        setTimerRunning(false);
      }
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerRef.current);
    setTimerRunning(false);
  }

  useEffect(() => {
    setText('');
    setTimerLeft(null);
    setTimerRunning(false);
    clearInterval(timerRef.current);
    if (STEPS[stepIdx]?.type === 'timer') {
      startTimer(STEPS[stepIdx].duration);
    }
    return () => clearInterval(timerRef.current);
  }, [stepIdx]);

  useEffect(() => () => clearInterval(timerRef.current), []);

  function next() {
    if (stepIdx + 1 >= STEPS.length) {
      setDone(true);
    } else {
      setStepIdx(i => i + 1);
    }
  }

  if (done) {
    return (
      <>
        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🏆</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', marginBottom: 8 }}>You're ready.</div>
          <div style={{ fontSize: 13, color: '#555', lineHeight: 1.7, marginBottom: 24 }}>You've prepared your mind. Now trust the work you've put in and go compete.</div>
          <button className="btn-full primary" onClick={() => { setStepIdx(0); setDone(false); setAffirmIdx(0); }}>Run it again</button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="section-label">Pre-game mental prep</div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <div style={{ fontSize: 12, color: '#aaa' }}>Step {stepIdx + 1} of {STEPS.length}</div>
          <div style={{ fontSize: 12, color: '#1D9E75', fontWeight: 600 }}>{step.label}</div>
        </div>
        <div style={{ height: 6, background: '#f0f0ec', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: 6, background: '#1D9E75', borderRadius: 4, width: `${progress}%`, transition: 'width 0.4s ease' }} />
        </div>
      </div>

      {step.type === 'read' && (
        <div>
          <div style={{ background: '#EEEDFE', borderRadius: 12, padding: '16px', marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: '#534AB7', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Opening intention</div>
            <div style={{ fontSize: 14, color: '#2D2880', lineHeight: 1.8, fontStyle: 'italic' }}>{fc.pregameOpener}</div>
          </div>
          <div style={{ fontSize: 13, color: '#555', lineHeight: 1.6, marginBottom: 20 }}>
            Read the above slowly. Take it in. This is your moment to transition from student mode to competitor mode.
          </div>
          <button className="btn-full primary" onClick={next}>I'm ready — next step</button>
        </div>
      )}

      {step.type === 'timer' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: '#555', lineHeight: 1.7, marginBottom: 20 }}>
            {stepIdx === 1
              ? 'Close your eyes. Scan from your feet upward — notice any tension without judging it. Breathe into tight spots. Let your body tell you what it needs.'
              : 'Close your eyes. See yourself competing at your best. Vivid detail: what you see, hear, and feel in your body. See yourself succeeding.'}
          </div>
          <div style={{ fontSize: 52, fontWeight: 800, color: '#1D9E75', marginBottom: 8 }}>
            {timerLeft !== null ? fmt(timerLeft) : fmt(step.duration)}
          </div>
          <div style={{ fontSize: 13, color: '#aaa', marginBottom: 24 }}>
            {timerRunning ? 'Timer running...' : timerLeft === 0 ? 'Complete' : 'Ready to begin'}
          </div>
          {timerLeft === 0 ? (
            <button className="btn-full primary" onClick={next}>Continue</button>
          ) : timerRunning ? (
            <button className="btn-full" onClick={stopTimer}>Skip</button>
          ) : (
            <button className="btn-full primary" onClick={() => startTimer(step.duration)}>Start timer</button>
          )}
        </div>
      )}

      {step.type === 'write' && (
        <div>
          <div style={{ fontSize: 13, color: '#555', lineHeight: 1.7, marginBottom: 12 }}>{step.prompt}</div>
          <textarea
            className="write-area"
            rows={4}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Write here..."
          />
          <button className="btn-full primary" disabled={!text.trim()} style={{ marginTop: 8 }} onClick={next}>
            {stepIdx + 1 >= STEPS.length ? "I'm ready" : 'Next step'}
          </button>
        </div>
      )}

      {step.type === 'affirm' && (
        <div>
          <div style={{ background: '#E1F5EE', borderRadius: 12, padding: '20px 16px', marginBottom: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#085041', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>Read this aloud</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#085041', lineHeight: 1.8, fontStyle: 'italic' }}>
              "{fc.affirmations[affirmIdx % fc.affirmations.length]}"
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn" style={{ flex: 1 }} onClick={() => setAffirmIdx(i => i + 1)}>Different one</button>
            <button className="btn primary" style={{ flex: 1 }} onClick={next}>Next step</button>
          </div>
        </div>
      )}
    </>
  );
}
