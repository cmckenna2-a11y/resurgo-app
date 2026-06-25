import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getFaithContent } from '../../data/faithContent';

const STAGES = [
  {
    id: 'shock',
    icon: '😶',
    color: '#E6F1FB',
    textColor: '#0C447C',
    label: 'Shock & denial',
    sub: '"This can\'t really be happening"',
    body: 'The first response to a significant injury is often disbelief. Your brain is protecting you by not fully processing it yet. This stage is normal — and it usually passes within days to a couple of weeks.',
    tools: [
      'Give yourself 24-48 hours before making any major decisions about your season or your future.',
      'Avoid catastrophizing — your brain will go to worst-case scenarios automatically in this stage.',
      'Talk to one trusted person: a teammate, a parent, a coach you trust. Don\'t isolate.',
      'Focus only on the next concrete step: seeing a doctor, getting an MRI, talking to the trainer.',
    ],
  },
  {
    id: 'anger',
    icon: '😤',
    color: '#FAECE7',
    textColor: '#6B2010',
    label: 'Frustration & anger',
    sub: '"Why me? This is so unfair"',
    body: 'Anger is a natural and healthy part of injury recovery. You worked hard, you had goals, and something outside your control derailed them. The frustration is legitimate — what matters is where you direct it.',
    tools: [
      'Find a physical outlet for the anger that is safe given your injury — this matters.',
      'Write out what you\'re angry about. Getting it out of your head and onto paper changes its weight.',
      'Distinguish between what you can control (your recovery effort, your mindset, your rehab) and what you can\'t.',
      'Anger that persists for weeks or turns inward into self-blame is worth talking to a counselor about.',
    ],
  },
  {
    id: 'grief',
    icon: '😔',
    color: '#EEEDFE',
    textColor: '#2D2880',
    label: 'Grief & isolation',
    sub: '"I don\'t even feel like an athlete anymore"',
    body: 'Many athletes experience a grief-like state when injured — a loss of identity, of routine, of community. Watching teammates compete while you sit out is genuinely painful. This stage is real, and it\'s one of the hardest.',
    tools: [
      'Stay connected to your team even if it\'s painful. Isolation makes this stage worse, not easier.',
      'Your athletic identity is real, but it is not all of who you are. This is worth exploring — ideally with a counselor.',
      'Find one thing you can do during recovery that is just for you — not for performance, not for the team.',
      'If you are feeling depressed, not just sad — low energy, no motivation, hopelessness — please talk to someone.',
    ],
  },
  {
    id: 'acceptance',
    icon: '🌱',
    color: '#E1F5EE',
    textColor: '#085041',
    label: 'Acceptance',
    sub: '"Okay. This is real. What now?"',
    body: 'Acceptance is not resignation — it\'s the moment when you stop fighting reality and start working with it. This is when real recovery begins, both mentally and physically.',
    tools: [
      'Set small, concrete recovery goals. Weekly milestones beat fixating on a return date.',
      'Find ways to contribute to your team that don\'t require your injured body — leadership, support, presence.',
      'Start rebuilding the parts of yourself that don\'t depend on competition.',
      'Recovery setbacks are normal. Acceptance is not a one-time event — you may cycle back to earlier stages temporarily.',
    ],
  },
  {
    id: 'rebuild',
    icon: '💪',
    color: '#FEF3E2',
    textColor: '#7A4F10',
    label: 'Rebuilding & return',
    sub: 'Coming back stronger',
    body: 'Return to sport is exciting — and also anxiety-provoking. Fear of re-injury, uncertainty about your level, and readjusting to competition after time away are all normal. Go at the pace your body and mind can handle.',
    tools: [
      'It is normal to feel anxious when you return to the activity that got you hurt. Name it, don\'t suppress it.',
      'Your fitness and form will come back faster than you expect. Trust the process.',
      'Use the pre-game mental prep tool — returning athletes benefit significantly from structured mental routines.',
      'The mental lessons from this injury are permanent. Many athletes say their best performances came after their hardest injuries.',
    ],
  },
];

export default function InjuryRecovery() {
  const { profile } = useAuth();
  const fc = getFaithContent(profile?.onboarding);
  const [open, setOpen] = useState(null);

  if (open !== null) {
    const stage = STAGES[open];
    return (
      <>
        <button onClick={() => setOpen(null)} style={{ background: 'none', border: 'none', color: '#888', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 16 }}>← Back</button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: stage.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{stage.icon}</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>{stage.label}</div>
            <div style={{ fontSize: 13, color: '#888', fontStyle: 'italic' }}>{stage.sub}</div>
          </div>
        </div>

        <div style={{ background: stage.color, borderRadius: 12, padding: '14px 16px', marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: stage.textColor, lineHeight: 1.7 }}>{stage.body}</div>
        </div>

        <div className="section-label">What actually helps at this stage</div>
        {stage.tools.map((tip, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: stage.textColor, flexShrink: 0, marginTop: 6 }} />
            <div style={{ fontSize: 13, color: '#333', lineHeight: 1.7 }}>{tip}</div>
          </div>
        ))}

        <div style={{ background: '#f9f9f7', border: '0.5px solid #e5e5e0', borderRadius: 12, padding: '14px 16px', marginTop: 8, marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: '#aaa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>A note for you</div>
          <div style={{ fontSize: 13, color: '#555', lineHeight: 1.7, fontStyle: 'italic' }}>{fc.injuryPrompt}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="section-label">Injury recovery</div>
      <div style={{ background: '#f9f9f7', border: '0.5px solid #e5e5e0', borderRadius: 12, padding: '12px 14px', marginBottom: 16, fontSize: 13, color: '#555', lineHeight: 1.6 }}>
        Recovery has emotional stages as real as the physical ones. Find where you are right now — it changes over time.
      </div>

      {STAGES.map((stage, i) => (
        <div key={stage.id} className="tool-menu-card" onClick={() => setOpen(i)}>
          <div className="tool-menu-icon" style={{ background: stage.color }}>{stage.icon}</div>
          <div className="tool-menu-body">
            <div className="tool-menu-title">{stage.label}</div>
            <div className="tool-menu-sub">{stage.sub}</div>
          </div>
          <div className="tool-menu-arrow">›</div>
        </div>
      ))}

      <div style={{ background: '#FCEBEB', borderRadius: 12, padding: '12px 14px', marginTop: 8, fontSize: 12, color: '#A32D2D', lineHeight: 1.6 }}>
        <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 13 }}>If you're struggling significantly</div>
        Injury-related depression, anxiety, and identity loss are real clinical issues. Talk to your athletic trainer or campus counseling center. If you're in crisis, call or text <strong>988</strong>.
      </div>
    </>
  );
}
