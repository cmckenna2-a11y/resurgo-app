import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="phone">
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: 'linear-gradient(160deg, #1A7A5E 0%, #155f49 45%, #0e4233 100%)', borderRadius: 0, overflow: 'hidden' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '32px 28px 20px' }}>
          <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 20, padding: '8px 20px', marginBottom: 24, display: 'inline-block' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.9)', letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 600 }}>Mental Wellness</div>
          </div>
          <div style={{ fontSize: 38, fontWeight: 900, color: '#fff', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6, lineHeight: 1 }}>Resurgo</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 28, fontStyle: 'italic' }}>I rise again</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 10, lineHeight: 1.4 }}>For students and athletes who want to feel better and perform better.</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, maxWidth: 260 }}>Daily check-ins, mental tools, peer support, and your campus resources — all in one place.</div>
        </div>
        <div style={{ padding: '16px 28px 40px', display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
          <button onClick={() => navigate('/signup')} style={{ width: '100%', padding: 16, background: '#fff', color: '#1A7A5E', border: 'none', borderRadius: 16, fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>Get started</button>
          <button onClick={() => navigate('/login')} style={{ width: '100%', padding: 14, background: 'transparent', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 16, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Already have an account? Sign in</button>
        </div>
      </div>
    </div>
  );
}
