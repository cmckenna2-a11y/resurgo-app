import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError('');
    if (!name.trim()) return setError('Please enter your name.');
    if (!email.includes('@')) return setError('Please enter a valid email.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    if (!ageConfirmed) return setError('Please confirm you are 18 or older.');

    setLoading(true);
    try {
      await signup({ name: name.trim(), email: email.toLowerCase().trim(), password, role });
      navigate('/onboarding');
    } catch (e) {
      setError(e.message || 'Could not create account. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="phone">
      <div className="auth-screen">
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#888', fontSize: 13, cursor: 'pointer', marginBottom: '1.5rem', textAlign: 'left', fontFamily: 'inherit' }}>← Back</button>
        <div className="auth-title">Create your account</div>
        <div className="auth-sub">Built for student athletes and college students.</div>

        <label className="field-label">Full name</label>
        <input className="field" type="text" placeholder="Alex Johnson" value={name} onChange={e => setName(e.target.value)} />

        <label className="field-label">Email</label>
        <input className="field" type="email" placeholder="you@university.edu" value={email} onChange={e => setEmail(e.target.value)} />

        <label className="field-label">Password</label>
        <input className="field" type="password" placeholder="At least 6 characters" value={password} onChange={e => setPassword(e.target.value)} />

        <label className="field-label">I am a...</label>
        <div className="role-row">
          <button className={`role-btn${role === 'student' ? ' selected' : ''}`} onClick={() => setRole('student')}>Student</button>
          <button className={`role-btn${role === 'athlete' ? ' selected' : ''}`} onClick={() => setRole('athlete')}>Student athlete</button>
        </div>

        {error && <div style={{ fontSize: 12, color: '#A32D2D', marginBottom: 10 }}>{error}</div>}

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14, padding: 12, background: 'var(--warm-gray)', borderRadius: 10, border: '1.5px solid var(--border)' }}>
          <input type="checkbox" id="age-confirm" checked={ageConfirmed} onChange={e => setAgeConfirmed(e.target.checked)} style={{ marginTop: 2, flexShrink: 0, accentColor: 'var(--green-dark)' }} />
          <label htmlFor="age-confirm" style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, cursor: 'pointer' }}>I confirm I am <strong>18 years of age or older</strong> and I agree to the Terms of Service and Privacy Policy.</label>
        </div>

        <button className="auth-btn" onClick={handleSubmit} disabled={loading}>{loading ? 'Creating account...' : 'Create account'}</button>
        <div className="auth-switch">Already have an account? <button className="auth-link" onClick={() => navigate('/login')}>Sign in</button></div>
      </div>
    </div>
  );
}
