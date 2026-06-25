import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError('');
    if (!email || !password) return setError('Please fill in all fields.');
    setLoading(true);
    try {
      await login({ email: email.toLowerCase().trim(), password });
      navigate('/');
    } catch (e) {
      setError('Incorrect email or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="phone">
      <div className="auth-screen">
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#888', fontSize: 13, cursor: 'pointer', marginBottom: '1.5rem', textAlign: 'left', fontFamily: 'inherit' }}>← Back</button>
        <div className="auth-title">Welcome back</div>
        <div className="auth-sub">Sign in to your Resurgo account</div>

        <label className="field-label">Email</label>
        <input className="field" type="email" placeholder="you@university.edu" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && !loading && handleSubmit()} />

        <label className="field-label">Password</label>
        <input className="field" type="password" placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && !loading && handleSubmit()} />

        <button onClick={() => navigate('/forgot')} style={{ background: 'none', border: 'none', color: 'var(--green-dark)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 10, textAlign: 'left', fontWeight: 600 }}>Forgot password?</button>

        {error && <div style={{ fontSize: 12, color: '#A32D2D', marginBottom: 10 }}>{error}</div>}

        <button className="auth-btn" onClick={handleSubmit} disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
        <div className="auth-switch">Don't have an account? <button className="auth-link" onClick={() => navigate('/signup')}>Create one</button></div>
      </div>
    </div>
  );
}
