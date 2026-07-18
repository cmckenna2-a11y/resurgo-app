import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getFaithContent } from '../../data/faithContent';

const CIRC = 2 * Math.PI * 84;
const PHASES = [
  { name: 'Inhale', sub: 'breathe in slowly through your nose', dur: 4, color: '#1D9E75' },
  { name: 'Hold', sub: 'hold your breath gently', dur: 7, color: '#534AB7' },
  { name: 'Exhale', sub: 'breathe out fully through your mouth', dur: 8, color: '#D85A30' },
];

export default function Breathing() {
  const { profile } = useAuth();
  const fc = getFaithContent(profile?.onboarding);

  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(0);
  const [count, setCount] = useState('-');
  const [cycles, setCycles] = useState(0);
  const [label, setLabel] = useState('Ready');
  const [sub, setSub] = useState('4 counts in · 7 hold · 8 out');
  const [offset, setOffset] = useState(CIRC);
  const [ringColor, setRingColor] = useState('#1D9E75');
  const [done, setDone] = useState(false);
  const [cyclesText, setCyclesText] = useState('4 cycles total');

  const timerRef = useRef(null);
  const phaseRef = useRef(0);
  const cycleRef = useRef(0);
  const mountedRef = useRef(true);

  function reset() {
    clearInterval(timerRef.current);
    phaseRef.current = 0;
    cycleRef.current = 0;
    setPhase(0); setCycles(0); setLabel('Ready'); setCount('-');
    setSub('4 counts in · 7 hold · 8 out'); setOffset(CIRC);
    setRingColor('#1D9E75'); setCyclesText('4 cycles total'); setDone(false);
  }

  function startPhase() {
    const ph = PHASES[phaseRef.current];
    setLabel(ph.name);
    setSub(ph.sub);
    setCount(ph.dur);
    setRingColor(ph.color);
    setOffset(CIRC);

    // Timestamp-based: iOS pauses timers while the app is backgrounded, so
    // counting interval ticks would freeze the exercise. Deriving elapsed
    // time from the clock keeps it correct after a suspend/resume.
    const startedAt = Date.now();
    timerRef.current = setInterval(() => {
      if (!mountedRef.current) { clearInterval(timerRef.current); return; }
      const elapsed = Math.min(ph.dur, Math.floor((Date.now() - startedAt) / 1000));
      setCount(elapsed < ph.dur ? ph.dur - elapsed : '');
      setOffset(CIRC * (1 - elapsed / ph.dur));

      if (elapsed >= ph.dur) {
        clearInterval(timerRef.current);
        phaseRef.current++;

        if (phaseRef.current >= PHASES.length) {
          phaseRef.current = 0;
          cycleRef.current++;
          setCycles(cycleRef.current);

          if (cycleRef.current >= 4) {
            setLabel('Complete');
            setSub('Great work. Notice how you feel.');
            setCount('');
            setOffset(0);
            setRingColor('#1D9E75');
            setCyclesText('4 cycles done');
            setDone(true);
            setRunning(false);
            return;
          }
          setCyclesText(`${4 - cycleRef.current} cycle${4 - cycleRef.current !== 1 ? 's' : ''} left`);
        }
        startPhase();
      }
    }, 250);
  }

  function toggle() {
    if (running) {
      clearInterval(timerRef.current);
      setRunning(false);
      reset();
    } else {
      reset();
      setRunning(true);
      setTimeout(startPhase, 50);
    }
  }

  useEffect(() => () => { mountedRef.current = false; clearInterval(timerRef.current); }, []);

  return (
    <>
      <div className="section-label">4-7-8 breathing</div>
      <div style={{ background: '#f9f9f7', border: '0.5px solid #e5e5e0', borderRadius: 12, padding: '12px 14px', marginBottom: 16, fontSize: 13, color: '#555', lineHeight: 1.6, fontStyle: 'italic' }}>
        {fc.breathIntro}
      </div>

      <div className="breath-wrap">
        <div className="phase-label">{label}</div>
        <div className="phase-sub">{done ? 'Great work. Notice how you feel.' : sub}</div>

        <div className="circle-wrap">
          <div className="circle-bg" />
          <svg width="180" height="180" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
            <circle cx="90" cy="90" r="84" fill="none" stroke={ringColor} strokeWidth="4"
              strokeDasharray={CIRC} strokeDashoffset={offset} strokeLinecap="round"
              style={{ transition: running ? 'stroke-dashoffset 1s linear' : 'none', willChange: 'stroke-dashoffset' }} />
          </svg>
          <div className="count-display">{count}</div>
        </div>

        <div className="cycle-dots">
          {[0, 1, 2, 3].map(i => <div key={i} className={`cycle-dot${i < cycles ? ' done' : ''}`} />)}
        </div>
        <div className="cycles-text">{cyclesText}</div>

        <button className={`btn${running || done ? '' : ' primary'}`} onClick={toggle}>
          {done ? 'Again' : running ? 'Stop' : 'Start'}
        </button>
      </div>
    </>
  );
}
