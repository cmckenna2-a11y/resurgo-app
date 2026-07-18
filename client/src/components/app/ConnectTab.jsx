import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { PEER_SITUATIONS, PEER_STORIES } from '../../data/peerStories';
import { SOCIAL_DATA } from '../../data/socialData';

// ── PEER STORIES ──
function PeerSection() {
  const [situation, setSituation] = useState(null);
  const [matching, setMatching] = useState(false);
  const [storyIdx, setStoryIdx] = useState(0);
  const [showStory, setShowStory] = useState(false);

  function selectSituation(id) {
    setSituation(id);
    setStoryIdx(0);
    setMatching(true);
    setShowStory(false);
    setTimeout(() => { setMatching(false); setShowStory(true); }, 1800);
  }

  const stories = situation ? (PEER_STORIES[situation] || []) : [];
  const story = stories[storyIdx % Math.max(stories.length, 1)];

  if (showStory && story) {
    return (
      <div>
        <button onClick={() => { setShowStory(false); setSituation(null); }} style={{ background: 'none', border: 'none', color: '#888', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 16 }}>← Back</button>
        <div style={{ background: '#f9f9f7', borderRadius: 14, padding: 14, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, color: '#0F6E56', flexShrink: 0 }}>{story.handle[0]}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{story.handle}</div>
              <div style={{ fontSize: 12, color: '#888' }}>{story.role}</div>
            </div>
            <div style={{ marginLeft: 'auto' }}><span className="badge">{story.detail}</span></div>
          </div>
        </div>

        <div className="section-label">Their story</div>
        {story.story.split('\n\n').map((p, i) => (
          <p key={i} style={{ fontSize: 13, color: '#333', lineHeight: 1.8, marginBottom: 12 }}>{p}</p>
        ))}

        <div style={{ background: '#E1F5EE', borderRadius: 12, padding: 14, marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: '#085041', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>What helped them</div>
          {story.helped.map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1D9E75', flexShrink: 0, marginTop: 6 }} />
              <div style={{ fontSize: 13, color: '#085041', lineHeight: 1.6 }}>{tip}</div>
            </div>
          ))}
        </div>

        {stories.length > 1 && (
          <button className="btn-full" onClick={() => setStoryIdx(i => i + 1)}>Show me someone else's story</button>
        )}

        <div style={{ background: '#FCEBEB', borderRadius: 12, padding: 14, fontSize: 12, color: '#A32D2D', lineHeight: 1.6, marginTop: 8 }}>
          <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 13 }}>Important reminder</div>
          This is peer support — not therapy or professional mental health advice. Stories reflect personal experiences only.<br /><br />
          <strong>If you are in crisis, call or text 988 immediately.</strong>
        </div>
      </div>
    );
  }

  if (matching) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a', marginBottom: 8 }}>Finding someone who gets it...</div>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 24 }}>Looking through people with similar experiences</div>
        <div style={{ height: 4, background: '#f0f0ec', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: 4, background: '#1D9E75', borderRadius: 2, width: '70%', transition: 'width 1.5s' }} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ background: '#E1F5EE', borderRadius: 12, padding: '12px 14px', marginBottom: 14, fontSize: 13, color: '#085041', lineHeight: 1.5 }}>
        Stories from students and athletes who've been through it. Names are never collected — only shared experiences.
      </div>
      <div style={{ background: '#FCEBEB', borderRadius: 12, padding: '12px 14px', marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#A32D2D', marginBottom: 4 }}>Peer support — not therapy or clinical advice</div>
        <div style={{ fontSize: 12, color: '#A32D2D', lineHeight: 1.6 }}>These are personal stories — not professional advice. If you are in crisis, call or text <strong>988</strong> now.</div>
      </div>
      <div className="section-label">What are you going through right now?</div>
      {PEER_SITUATIONS.map(sit => (
        <div key={sit.id} className="card" onClick={() => selectSituation(sit.id)} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 24, flexShrink: 0 }}>{sit.emoji}</div>
          <div className="card-title" style={{ marginBottom: 0 }}>{sit.label}</div>
          <div style={{ marginLeft: 'auto', fontSize: 18, color: '#aaa' }}>›</div>
        </div>
      ))}
    </div>
  );
}

// ── SOCIAL ADVICE ──
function SocialSection() {
  const [socialCat, setSocialCat] = useState('pressure');
  const [openItem, setOpenItem] = useState(null);

  const CATS = [
    { id: 'pressure', label: 'Social pressure', cls: 'teal' },
    { id: 'belonging', label: 'Belonging', cls: 'purple2' },
    { id: 'faith', label: 'Faith & social', cls: 'coral' },
    { id: 'athlete', label: 'Athlete life', cls: 'amber' },
    { id: 'relationships', label: 'Relationships', cls: '' },
  ];

  const items = SOCIAL_DATA[socialCat] || [];

  if (openItem !== null) {
    const item = items[openItem];
    return (
      <div>
        <button onClick={() => setOpenItem(null)} style={{ background: 'none', border: 'none', color: '#888', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', marginBottom: '1.5rem' }}>← Back</button>
        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{item.title}</div>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 20, lineHeight: 1.6 }}>{item.desc}</div>
        <div className="section-label">Real advice</div>
        {item.advice.map((a, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1D9E75', flexShrink: 0, marginTop: 6 }} />
            <div style={{ fontSize: 13, color: '#333', lineHeight: 1.7 }}>{a}</div>
          </div>
        ))}
        <div style={{ background: '#E1F5EE', borderRadius: 12, padding: '14px 16px' }}>
          <div style={{ fontSize: 11, color: '#085041', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Remember this</div>
          <div style={{ fontSize: 13, color: '#085041', lineHeight: 1.7, fontStyle: 'italic' }}>{item.mindset}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="cat-row">
        {CATS.map(c => (
          <button key={c.id} className={`cat-btn ${c.cls}${socialCat === c.id ? ' active' : ''}`} onClick={() => { setSocialCat(c.id); setOpenItem(null); }}>{c.label}</button>
        ))}
      </div>
      {items.map((item, i) => (
        <div key={i} className="card" onClick={() => setOpenItem(i)}>
          <div className="card-row">
            <div className="card-title">{item.title}</div>
            <span style={{ fontSize: 18, color: '#aaa' }}>›</span>
          </div>
          <div className="card-sub">{item.desc}</div>
        </div>
      ))}
    </div>
  );
}

// ── SHARE STORY ──
function ShareSection() {
  const { user } = useAuth();
  const [situation, setSituation] = useState('');
  const [story, setStory] = useState('');
  const [helped, setHelped] = useState('');
  const [advice, setAdvice] = useState('');
  const [ageConfirm, setAgeConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const wordCount = useMemo(() => story.trim().split(/\s+/).filter(Boolean).length, [story]);

  const SITUATIONS = ['exam', 'burnout', 'injury', 'slump', 'lonely', 'identity', 'pressure', 'anxiety'];
  const SITUATION_LABELS = { exam: 'Exam anxiety', burnout: 'Burnout', injury: 'Injury recovery', slump: 'Performance slump', lonely: 'Loneliness', identity: 'Identity & purpose', pressure: 'Social pressure', anxiety: 'Anxiety' };

  async function submit() {
    setError('');
    if (!situation) return setError('Please select a situation.');
    if (wordCount < 30) return setError('Please write at least 30 words in your story.');
    if (!helped.trim()) return setError('Please fill in what helped you.');
    if (!advice.trim()) return setError('Please add your piece of advice.');
    if (!ageConfirm) return setError('Please confirm you are 18 or older.');

    setSubmitting(true);
    try {
      await api.stories.submit({ situation, story, helped, advice });
      setSubmitted(true);
    } catch (e) {
      setError(e.message || 'Could not submit. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>❤️</div>
        <div style={{ fontSize: 18, fontWeight: 600, color: '#1a1a1a', marginBottom: 8 }}>Thank you for sharing</div>
        <div style={{ fontSize: 13, color: '#888', lineHeight: 1.6, marginBottom: 20 }}>Your story will be reviewed and added to the community. Someone out there is going to feel a lot less alone because of what you wrote.</div>
        <button className="btn-full primary" onClick={() => setSubmitted(false)}>Share another story</button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ background: '#E1F5EE', borderRadius: 12, padding: 14, marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#085041', marginBottom: 6 }}>Your story could help someone</div>
        <div style={{ fontSize: 13, color: '#085041', lineHeight: 1.6 }}>Every story submitted is reviewed before going live. Your name is never collected — only your experience.</div>
      </div>

      <div className="section-label">What situation does your story relate to?</div>
      <div className="cat-row" style={{ flexWrap: 'wrap', marginBottom: 16 }}>
        {SITUATIONS.map(s => (
          <button key={s} className={`cat-btn teal${situation === s ? ' active' : ''}`} onClick={() => setSituation(s)}>{SITUATION_LABELS[s]}</button>
        ))}
      </div>
      {situation && <div style={{ fontSize: 12, color: '#1D9E75', marginBottom: 12 }}>Selected: {SITUATION_LABELS[situation]}</div>}

      <div className="section-label">Your story</div>
      <textarea className="write-area" rows={6} placeholder="e.g. My sophomore year I got injured two weeks before conference championships..." value={story} onChange={e => setStory(e.target.value)} />
      <div className="char-count">{wordCount} words</div>

      <div className="section-label">What actually helped you?</div>
      <textarea className="write-area" rows={4} placeholder="e.g. Going to the counseling center for the first time..." value={helped} onChange={e => setHelped(e.target.value)} />

      <div className="section-label">One piece of advice</div>
      <textarea className="write-area" rows={3} placeholder="e.g. You don't have to have it figured out. Just get through today." value={advice} onChange={e => setAdvice(e.target.value)} />

      <div style={{ background: '#f9f9f7', borderRadius: 12, padding: '12px 14px', marginBottom: 16, fontSize: 12, color: '#555', lineHeight: 1.7 }}>
        <div style={{ fontWeight: 600, color: '#1a1a1a', marginBottom: 6 }}>Before you submit:</div>
        {['Do not include your name, school, team, or any identifying details', 'Do not describe methods of self-harm or suicide in detail', 'Stories are reviewed before going live', 'By submitting you confirm this story is your own experience'].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 5 }}><span style={{ color: '#1D9E75' }}>✓</span><span>{item}</span></div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 16, padding: 12, background: '#f9f9f7', borderRadius: 10, border: '1px solid #e5e5e0' }}>
        <input type="checkbox" id="share-age" checked={ageConfirm} onChange={e => setAgeConfirm(e.target.checked)} style={{ marginTop: 2, flexShrink: 0, accentColor: '#1D9E75' }} />
        <label htmlFor="share-age" style={{ fontSize: 13, color: '#555', lineHeight: 1.5, cursor: 'pointer' }}>I confirm I am <strong>18 or older</strong>, this story is my own experience, and it does not contain identifying information about real people.</label>
      </div>

      {error && <div style={{ fontSize: 12, color: '#A32D2D', marginBottom: 10 }}>{error}</div>}
      <button className="btn-full primary" onClick={submit} disabled={submitting}>{submitting ? 'Submitting...' : 'Submit for review'}</button>
    </div>
  );
}

// ── MAIN CONNECT TAB ──
export default function ConnectTab() {
  const [section, setSection] = useState('peer');

  const SECTIONS = [
    { id: 'peer', label: 'Peer stories', cls: 'teal' },
    { id: 'social', label: 'Social advice', cls: 'purple2' },
    { id: 'share', label: 'Share yours', cls: 'coral' },
  ];

  return (
    <>
      <div className="section-label">Connect</div>
      <div style={{ fontSize: 13, color: '#888', marginBottom: 14, lineHeight: 1.5 }}>Stories from people who've been through it. Share yours to help someone else.</div>
      <div className="cat-row">
        {SECTIONS.map(s => (
          <button key={s.id} className={`cat-btn ${s.cls}${section === s.id ? ' active' : ''}`} onClick={() => setSection(s.id)}>{s.label}</button>
        ))}
      </div>
      {section === 'peer' && <PeerSection />}
      {section === 'social' && <SocialSection />}
      {section === 'share' && <ShareSection />}
    </>
  );
}
