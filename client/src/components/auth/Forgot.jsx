import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function Forgot() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email) return;
    setLoading(true);
    try {
      await supabase.auth.resetPasswordForEmail(email.trim());
      setSent(true);
    } catch (e) {
      // network failure — leave the form usable so they can retry
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="phone">
      <div className="auth-screen">
        <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#888', fontSize: 13, cursor: 'pointer', marginBottom: '1.5rem', textAlign: 'left', fontFamily: 'inherit' }}>← Back</button>
        <div className="auth-title">Reset password</div>
        <div className="auth-sub">Enter your email and we'll send a reset link.</div>

        <label className="field-label">Email</label>
        <input className="field" type="email" placeholder="you@university.edu" value={email} onChange={e => setEmail(e.target.value)} />

        {sent && (
          <div style={{ fontSize: 13, color: '#1D9E75', marginBottom: 12, padding: '10px 14px', background: 'var(--green-pale)', borderRadius: 10 }}>
            If an account with that email exists, a reset link has been sent. Check your inbox.
          </div>
        )}

        <button className="auth-btn" onClick={handleSubmit} disabled={loading || sent}>{sent ? 'Email sent' : loading ? 'Sending...' : 'Send reset link'}</button>
      </div>
    </div>
  );
}
