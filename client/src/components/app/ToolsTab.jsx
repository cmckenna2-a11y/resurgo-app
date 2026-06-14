import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Breathing from '../tools/Breathing';
import StudyBreak from '../tools/StudyBreak';
import Burnout from '../tools/Burnout';
import StressType from '../tools/StressType';
import ExamToolkit from '../tools/ExamToolkit';
import Pregame from '../tools/Pregame';
import InjuryRecovery from '../tools/InjuryRecovery';

const DISCLAIMER = (
  <div style={{ background: '#EEF8F3', borderRadius: 12, padding: '12px 14px', marginTop: 20, fontSize: 12, color: '#1A7A5E', lineHeight: 1.6 }}>
    <strong>Resurgo is a wellness tool, not a clinical service.</strong> These tools are not a substitute for professional mental health support. If you are in crisis, call or text <strong>988</strong>.
  </div>
);

const COLLEGE_RESOURCES = {
  'Bates College': {
    name: 'Bates College', color: '#8B0000',
    resources: [
      { title: 'CAPS — Counseling & Psychological Services', sub: 'Free confidential counseling', url: 'https://www.bates.edu/counseling-psychological-services/', icon: '🧠' },
      { title: 'Student Well-Being at Bates', sub: 'Wellness programs and holistic health support', url: 'https://www.bates.edu/well-being/', icon: '🌿' },
      { title: 'Here to Help — Confidential Support', sub: 'Full list of confidential resources at Bates', url: 'https://www.bates.edu/here-to-help/confidential-non-confidential-support/', icon: '👥' },
    ],
  },
};

export default function ToolsTab() {
  const { profile } = useAuth();
  const [activeTool, setActiveTool] = useState(null);
  const isAthlete = profile?.role === 'athlete';
  const school = COLLEGE_RESOURCES[profile?.school];

  const TOOLS = [
    { id: 'breathe', icon: '🌿', bg: '#E1F5EE', title: '4-7-8 breathing', sub: 'Calm your nervous system in 3 minutes' },
    { id: 'break', icon: '⏱', bg: '#EEEDFE', title: 'Study break timer', sub: '45 min focus, 5 min reset' },
    { id: 'burnout', icon: '🟢', bg: '#FAEEDA', title: 'Burnout check-in', sub: 'See where your mental energy really is' },
    { id: 'stress', icon: '🌊', bg: '#E6F1FB', title: 'Stress type identifier', sub: 'Not all stress is the same — find yours' },
    ...(!isAthlete ? [{ id: 'exam', icon: '📚', bg: '#E6F1FB', title: 'Exam anxiety toolkit', sub: 'Week before through after — all 5 phases' }] : []),
    ...(isAthlete ? [
      { id: 'pregame', icon: '🏆', bg: '#EEEDFE', title: 'Pre-game mental prep', sub: 'Faith-personalized 6-step routine' },
      { id: 'injury', icon: '🏥', bg: '#FAECE7', title: 'Injury recovery', sub: 'Mental support for your recovery journey' },
    ] : []),
  ];

  const TOOL_COMPONENTS = {
    breathe: <><Breathing />{DISCLAIMER}</>,
    break: <><StudyBreak />{DISCLAIMER}</>,
    burnout: <><Burnout />{DISCLAIMER}</>,
    stress: <><StressType />{DISCLAIMER}</>,
    exam: <><ExamToolkit />{DISCLAIMER}</>,
    pregame: <><Pregame />{DISCLAIMER}</>,
    injury: <><InjuryRecovery />{DISCLAIMER}</>,
  };

  if (activeTool) {
    return (
      <div style={{ position: 'absolute', inset: 0, background: '#fff', borderRadius: 24, zIndex: 10, overflowY: 'auto', padding: 16 }}>
        <button onClick={() => setActiveTool(null)} style={{ background: 'none', border: 'none', color: '#888', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 16, paddingTop: 'var(--safe-top, 44px)', display: 'block' }}>← Back to tools</button>
        {TOOL_COMPONENTS[activeTool]}
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <div className="section-label">What do you need right now?</div>

      {TOOLS.map(tool => (
        <div key={tool.id} className="tool-menu-card" onClick={() => setActiveTool(tool.id)}>
          <div className="tool-menu-icon" style={{ background: tool.bg }}>{tool.icon}</div>
          <div className="tool-menu-body">
            <div className="tool-menu-title">{tool.title}</div>
            <div className="tool-menu-sub">{tool.sub}</div>
          </div>
          <div className="tool-menu-arrow">›</div>
        </div>
      ))}

      <div className="divider" />
      <div className="section-label">Your school</div>
      {school ? (
        <>
          <div style={{ background: 'var(--warm-gray)', borderLeft: `4px solid ${school.color}`, borderRadius: 12, padding: '12px 14px', marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{school.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Your campus mental health resources</div>
          </div>
          {school.resources.map((r, i) => (
            <a key={i} className="resource-card" href={r.url} target="_blank" rel="noreferrer">
              <div className="resource-icon" style={{ background: 'var(--green-pale)' }}>{r.icon}</div>
              <div style={{ flex: 1 }}><div className="resource-title">{r.title}</div><div className="resource-sub">{r.sub}</div></div>
              <div style={{ fontSize: 18, color: 'var(--text-muted)' }}>›</div>
            </a>
          ))}
        </>
      ) : (
        <div style={{ background: 'var(--warm-gray)', borderRadius: 12, padding: '12px 14px', fontSize: 13, color: 'var(--text-muted)' }}>
          Set your school in the <strong>You</strong> tab to see your campus resources here.
        </div>
      )}
    </div>
  );
}
