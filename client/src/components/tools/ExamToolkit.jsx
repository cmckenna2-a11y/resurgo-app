import { useState } from 'react';
import { EXAM_PHASES } from '../../data/examData';

export default function ExamToolkit() {
  const [activePhase, setActivePhase] = useState('week');
  const phase = EXAM_PHASES[activePhase];

  return (
    <>
      <div className="section-label">Exam anxiety toolkit</div>
      <div style={{ background: '#f9f9f7', border: '0.5px solid #e5e5e0', borderRadius: 12, padding: '12px 14px', marginBottom: 16, fontSize: 13, color: '#555', lineHeight: 1.6 }}>
        Exam anxiety is real — and specific strategies work at each stage. Choose where you are right now.
      </div>

      <div className="cat-row" style={{ flexWrap: 'wrap', marginBottom: 16 }}>
        {Object.entries(EXAM_PHASES).map(([id, ph]) => (
          <button key={id}
            className={`cat-btn teal${activePhase === id ? ' active' : ''}`}
            onClick={() => setActivePhase(id)}>
            {ph.label}
          </button>
        ))}
      </div>

      <div style={{ background: phase.color || '#E1F5EE', borderRadius: 12, padding: '12px 14px', marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: phase.textColor || '#085041', marginBottom: 2 }}>{phase.label}</div>
      </div>

      {phase.steps.map((step, i) => (
        <div key={i} style={{ background: '#fff', border: '1px solid #e5e5e0', borderRadius: 12, padding: '14px 16px', marginBottom: 10 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: phase.color || '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: phase.textColor || '#085041', flexShrink: 0 }}>{i + 1}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', marginBottom: 6 }}>{step.title}</div>
              <div style={{ fontSize: 13, color: '#555', lineHeight: 1.7 }}>{step.body}</div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
