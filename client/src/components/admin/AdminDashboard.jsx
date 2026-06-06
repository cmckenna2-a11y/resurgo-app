import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';

const NAV = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'mood', label: 'Mood data', icon: '📈' },
  { id: 'submissions', label: 'Story review', icon: '📝' },
  { id: 'users', label: 'Users', icon: '👥' },
];

const MOOD_COLORS = ['#F09595', '#FAC775', '#B5D4F4', '#9FE1CB', '#5DCAA5'];
const MOOD_LABELS = { 1: 'Rough', 2: 'Meh', 3: 'Okay', 4: 'Good', 5: 'Great' };

function StatCard({ label, value, sub, color }) {
  return (
    <div className="stat-card">
      <div className="stat-value" style={color ? { color } : {}}>{value ?? '—'}</div>
      <div className="stat-label">{label}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

function OverviewPanel({ stats }) {
  if (!stats) return <div style={{ color: '#aaa', fontSize: 14 }}>Loading stats...</div>;
  return (
    <>
      <h2 style={{ margin: '0 0 20px', fontSize: 20, fontWeight: 700 }}>Overview</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14, marginBottom: 28 }}>
        <StatCard label="Total users" value={stats.totalUsers} />
        <StatCard label="Students" value={stats.students} />
        <StatCard label="Athletes" value={stats.athletes} />
        <StatCard label="Active (7d)" value={stats.activeUsers7d} color="#1D9E75" />
        <StatCard label="Check-ins today" value={stats.checkInsToday} color="#534AB7" />
        <StatCard label="Journal entries" value={stats.totalJournalEntries} />
        <StatCard label="Pending stories" value={stats.pendingStories} color={stats.pendingStories > 0 ? '#D68B2E' : undefined} />
      </div>
    </>
  );
}

function MoodPanel({ trend, distribution }) {
  return (
    <>
      <h2 style={{ margin: '0 0 20px', fontSize: 20, fontWeight: 700 }}>Mood data</h2>

      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Daily average mood — last 30 days</div>
        {trend?.length ? (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trend} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0ec" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={d => d.slice(5)} />
              <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => [Number(v).toFixed(2), 'Avg mood']} labelFormatter={l => `Date: ${l}`} />
              <Line type="monotone" dataKey="avg" stroke="#1D9E75" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ color: '#aaa', fontSize: 13 }}>No mood data yet.</div>
        )}
      </div>

      <div>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Mood distribution (all time)</div>
        {distribution?.length ? (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={distribution} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0ec" />
              <XAxis dataKey="mood" tickFormatter={v => MOOD_LABELS[v]} tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v, n, p) => [v, MOOD_LABELS[p.payload.mood]]} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {distribution.map((d, i) => (
                  <Cell key={i} fill={MOOD_COLORS[d.mood - 1]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ color: '#aaa', fontSize: 13 }}>No mood data yet.</div>
        )}
      </div>
    </>
  );
}

function SubmissionsPanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  async function load() {
    setLoading(true);
    try {
      const data = await api.admin.submissions(filter);
      setItems(data || []);
    } catch {}
    setLoading(false);
  }

  useEffect(() => { load(); }, [filter]);

  async function review(id, status) {
    try {
      await api.admin.reviewSubmission(id, status);
      load();
    } catch {}
  }

  return (
    <>
      <h2 style={{ margin: '0 0 16px', fontSize: 20, fontWeight: 700 }}>Story review</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['pending', 'approved', 'rejected'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            style={{ padding: '6px 14px', borderRadius: 20, border: '1px solid #e5e5e0', background: filter === s ? '#1D9E75' : '#fff', color: filter === s ? '#fff' : '#555', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize' }}>
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ color: '#aaa', fontSize: 13 }}>Loading...</div>
      ) : items.length === 0 ? (
        <div style={{ color: '#aaa', fontSize: 13 }}>No {filter} submissions.</div>
      ) : (
        <div>
          {items.map(item => (
            <div key={item.id} className="admin-table-row" style={{ background: '#fff', border: '1px solid #e5e5e0', borderRadius: 12, padding: 16, marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span className="badge">{item.situation}</span>
                <span style={{ fontSize: 11, color: '#aaa' }}>{new Date(item.created_at).toLocaleDateString()}</span>
              </div>
              <div style={{ fontSize: 13, color: '#333', lineHeight: 1.7, marginBottom: 8, maxHeight: 80, overflow: 'hidden' }}>{item.story}</div>
              <div style={{ fontSize: 12, color: '#555', marginBottom: 8 }}><strong>Helped:</strong> {item.helped}</div>
              <div style={{ fontSize: 12, color: '#555', marginBottom: 12 }}><strong>Advice:</strong> {item.advice}</div>
              {filter === 'pending' && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="approve-btn" onClick={() => review(item.id, 'approved')}>Approve</button>
                  <button className="reject-btn" onClick={() => review(item.id, 'rejected')}>Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function UsersPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.admin.users().then(d => { setUsers(d || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <>
      <h2 style={{ margin: '0 0 16px', fontSize: 20, fontWeight: 700 }}>Users</h2>
      {loading ? (
        <div style={{ color: '#aaa', fontSize: 13 }}>Loading...</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>School</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className="badge">{u.role}</span></td>
                  <td>{u.school || '—'}</td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default function AdminDashboard() {
  const { profile, logout } = useAuth();
  const [nav, setNav] = useState('overview');
  const [stats, setStats] = useState(null);
  const [trend, setTrend] = useState([]);
  const [distribution, setDistribution] = useState([]);

  useEffect(() => {
    api.admin.stats().then(setStats).catch(() => {});
    api.admin.moodTrend().then(setTrend).catch(() => {});
    api.admin.moodDistribution().then(setDistribution).catch(() => {});
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', fontFamily: 'inherit', background: '#f5f5f2' }}>
      <div className="admin-sidebar">
        <div style={{ padding: '24px 20px 20px' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Resurgo</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Admin dashboard</div>
        </div>

        <nav style={{ padding: '0 10px' }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => setNav(n.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px',
                borderRadius: 10, border: 'none', background: nav === n.id ? 'rgba(255,255,255,0.15)' : 'none',
                color: nav === n.id ? '#fff' : 'rgba(255,255,255,0.65)', fontSize: 14, cursor: 'pointer',
                fontFamily: 'inherit', fontWeight: nav === n.id ? 600 : 400, marginBottom: 4, textAlign: 'left',
              }}>
              <span>{n.icon}</span>
              <span>{n.label}</span>
            </button>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', padding: '20px' }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>{profile?.name}</div>
          <button onClick={logout} style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>Sign out</button>
        </div>
      </div>

      <div className="admin-content">
        {nav === 'overview' && <OverviewPanel stats={stats} />}
        {nav === 'mood' && <MoodPanel trend={trend} distribution={distribution} />}
        {nav === 'submissions' && <SubmissionsPanel />}
        {nav === 'users' && <UsersPanel />}
      </div>
    </div>
  );
}
