import { useState } from 'react';

const STRESS_TYPES = [
  {
    id: 'academic',
    icon: '📚',
    bg: '#E1F5EE',
    color: '#085041',
    title: 'Academic stress',
    sub: 'Exams, grades, workload, keeping up',
    signs: [
      'You lie awake thinking about assignments or grades',
      'You feel behind no matter how much you study',
      'You compare yourself to other students constantly',
      'You feel like you\'re not smart enough to be here',
    ],
    advice: [
      'Break your workload into 25-minute focused blocks. Not 3-hour sessions — those are exhausting and ineffective.',
      'Your grade does not equal your worth. One bad exam will not define your career or your life.',
      'Go to office hours — professors notice effort more than grades.',
      'Talk to academic support before you feel desperate, not after.',
      'Every student around you is struggling too. Academic impostor syndrome is almost universal.',
    ],
    mindset: 'You were admitted because you can do this work. The pressure is real, but you have more capacity than you think.',
  },
  {
    id: 'social',
    icon: '👥',
    bg: '#EEEDFE',
    color: '#2D2880',
    title: 'Social stress',
    sub: 'Belonging, relationships, fitting in',
    signs: [
      'You feel like everyone else has figured out their social life except you',
      'You overthink what you said or did in conversations',
      'You feel lonely even when you\'re surrounded by people',
      'You feel pressure to be a certain way to be liked',
    ],
    advice: [
      'Genuine connection is slower and rarer than social media suggests. Most people feel what you\'re feeling.',
      'You don\'t need a big friend group — two or three real connections matter far more.',
      'Put your phone away in group settings. Eye contact and presence build connection faster than any app.',
      'Shared experiences create bonds faster than conversation. Join one thing that meets weekly.',
      'Being awkward around new people is not a personality flaw. It is just being human.',
    ],
    mindset: 'Belonging takes time. You are not behind — you are just still building.',
  },
  {
    id: 'financial',
    icon: '💸',
    bg: '#FEF3E2',
    color: '#7A4F10',
    title: 'Financial stress',
    sub: 'Money, debt, costs, economic pressure',
    signs: [
      'You regularly worry about affording basics or tuition',
      'You feel embarrassed by your financial situation compared to peers',
      'Financial stress is affecting your concentration and sleep',
      'You feel like you\'re at a disadvantage because of money',
    ],
    advice: [
      'Go to the financial aid office in person — ask specifically about emergency grants and work-study.',
      'Your school likely has food pantries, clothing closets, and emergency funds most students don\'t know about.',
      'Financial stress is legitimately hard. Acknowledge it — don\'t minimize it.',
      'Talk to a counselor about it. Financial stress drives academic stress, sleep issues, and anxiety.',
      'You are not less capable because you have fewer resources. You are doing more with less — that matters.',
    ],
    mindset: 'You are working harder than most students just to be here. That resilience is real and it\'s yours.',
  },
  {
    id: 'identity',
    icon: '🪞',
    bg: '#E6F1FB',
    color: '#0D4F7E',
    title: 'Identity stress',
    sub: 'Purpose, values, who you\'re becoming',
    signs: [
      'You feel unsure of who you are outside of your role (student, athlete, etc.)',
      'You feel pressure to become a specific kind of person',
      'You question whether the path you\'re on is really yours',
      'You feel conflict between your background and where you are now',
    ],
    advice: [
      'Identity confusion in your early 20s is not a crisis — it is the work. This discomfort means you\'re growing.',
      'Write about it. Journaling through identity questions is one of the most effective ways to process them.',
      'Who you are right now does not have to be permanent. You are allowed to change.',
      'Talk to older students or mentors who navigated similar questions — their experience is genuinely useful.',
      'Your values matter more than your major, your career, or your social image.',
    ],
    mindset: 'The fact that you\'re asking who you are is a sign of self-awareness most people never develop.',
  },
  {
    id: 'performance',
    icon: '🏆',
    bg: '#FAECE7',
    color: '#6B2010',
    title: 'Performance stress',
    sub: 'Pressure to succeed, failure fear, expectations',
    signs: [
      'You fear failure more than you enjoy success',
      'You avoid situations where you might not perform well',
      'You feel like disappointing others would be catastrophic',
      'You feel like your value depends on how well you do',
    ],
    advice: [
      'Separate your identity from your performance. You are not your GPA, your playing time, or your output.',
      'The pressure you feel is often self-generated — ask yourself: whose voice is this actually?',
      'Failure is data. It tells you what to adjust. It does not tell you anything about your worth.',
      'High performers in every field experience this. Seek out their stories — imposter syndrome is almost universal.',
      'Process-focus beats outcome-focus consistently. Ask: did I give my best effort today? That\'s what you control.',
    ],
    mindset: 'The fear means you care. But caring should fuel your effort, not your self-worth.',
  },
  {
    id: 'emotional',
    icon: '💭',
    bg: '#F3E8F9',
    color: '#4A1D72',
    title: 'Emotional stress',
    sub: 'Grief, anxiety, depression, emotional overload',
    signs: [
      'You feel sadness, numbness, or emptiness that doesn\'t fully lift',
      'Your emotions feel overwhelming or out of control',
      'You feel anxious much of the time without a clear reason',
      'You\'ve been through something hard and haven\'t fully processed it',
    ],
    advice: [
      'What you\'re feeling is real and it deserves attention — not suppression.',
      'Counseling is not for people who are broken. It is for people who are carrying something heavy.',
      'Identify one person you trust and tell them something true about how you\'re doing.',
      'Physical movement, sleep, and limiting alcohol genuinely help regulate emotional states.',
      'If you feel like you can\'t cope, please reach out to 988 or your campus counseling center today.',
    ],
    mindset: 'Emotions are information. The goal is not to eliminate them — it\'s to understand what they\'re telling you.',
  },
];

export default function StressType() {
  const [open, setOpen] = useState(null);

  if (open !== null) {
    const type = STRESS_TYPES[open];
    return (
      <>
        <button onClick={() => setOpen(null)} style={{ background: 'none', border: 'none', color: '#888', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 16 }}>← Back</button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: type.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{type.icon}</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>{type.title}</div>
            <div style={{ fontSize: 13, color: '#888' }}>{type.sub}</div>
          </div>
        </div>

        <div className="section-label">Signs you might be here</div>
        {type.signs.map((sign, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: type.color, flexShrink: 0, marginTop: 6 }} />
            <div style={{ fontSize: 13, color: '#333', lineHeight: 1.7 }}>{sign}</div>
          </div>
        ))}

        <div className="section-label" style={{ marginTop: 16 }}>What actually helps</div>
        {type.advice.map((tip, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: type.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: type.color, flexShrink: 0 }}>{i + 1}</div>
            <div style={{ fontSize: 13, color: '#333', lineHeight: 1.7 }}>{tip}</div>
          </div>
        ))}

        <div style={{ background: type.bg, borderRadius: 12, padding: '14px 16px', marginTop: 8 }}>
          <div style={{ fontSize: 11, color: type.color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Remember this</div>
          <div style={{ fontSize: 13, color: type.color, lineHeight: 1.7, fontStyle: 'italic' }}>{type.mindset}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="section-label">Stress type identifier</div>
      <div style={{ background: '#f9f9f7', border: '0.5px solid #e5e5e0', borderRadius: 12, padding: '12px 14px', marginBottom: 16, fontSize: 13, color: '#555', lineHeight: 1.6 }}>
        Not all stress is the same — and what helps depends on the type. Find the category that fits best right now.
      </div>

      {STRESS_TYPES.map((type, i) => (
        <div key={type.id} className="tool-menu-card" onClick={() => setOpen(i)}>
          <div className="tool-menu-icon" style={{ background: type.bg }}>{type.icon}</div>
          <div className="tool-menu-body">
            <div className="tool-menu-title">{type.title}</div>
            <div className="tool-menu-sub">{type.sub}</div>
          </div>
          <div className="tool-menu-arrow">›</div>
        </div>
      ))}
    </>
  );
}
