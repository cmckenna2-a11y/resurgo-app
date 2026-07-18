import { useState, useMemo, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import HomeTab from './HomeTab';
import ToolsTab from './ToolsTab';
import JournalTab from './JournalTab';
import ConnectTab from './ConnectTab';
import YouTab from './YouTab';

function getInitials(name = '') {
  return name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

// Static — defined once, never rebuilt on render.
const TABS = [
  { id: 'home', label: 'Home' },
  { id: 'tools', label: 'Tools' },
  { id: 'journal', label: 'Journal' },
  { id: 'connect', label: 'Connect' },
  { id: 'you', label: 'You' },
];

export default function AppShell() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  // Lazy-mount: only render a tab's component the first time it becomes active.
  // Subsequent visits keep it mounted (preserving state) but CSS hides it.
  // This eliminates 4 background tab mounts + their API calls on startup.
  const [mounted, setMounted] = useState({ home: true });

  const firstName = useMemo(() => profile?.name?.split(' ')[0] || '', [profile?.name]);
  const initials = useMemo(() => getInitials(profile?.name), [profile?.name]);

  const navigate = useCallback((tab) => {
    setMounted(m => ({ ...m, [tab]: true }));
    setActiveTab(tab);
  }, []);

  return (
    <div className="phone">
      <div className="header">
        <div>
          <div className="header-title">Resurgo</div>
          <div className="header-sub">Hello, {firstName} 👋</div>
        </div>
        <div className="avatar" onClick={() => navigate('you')} title="Profile">{initials}</div>
      </div>

      <div className="nav">
        {TABS.map(t => (
          <button key={t.id} className={`nav-btn${activeTab === t.id ? ' active' : ''}`} onClick={() => navigate(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className={`tab${activeTab === 'home' ? ' active' : ''}`} id="tab-home">
        {mounted.home && <HomeTab active={activeTab === 'home'} onNavigate={navigate} />}
      </div>
      <div className={`tab${activeTab === 'tools' ? ' active' : ''}`} id="tab-tools">
        {mounted.tools && <ToolsTab active={activeTab === 'tools'} />}
      </div>
      <div className={`tab${activeTab === 'journal' ? ' active' : ''}`} id="tab-journal">
        {mounted.journal && <JournalTab active={activeTab === 'journal'} />}
      </div>
      <div className={`tab${activeTab === 'connect' ? ' active' : ''}`} id="tab-connect">
        {mounted.connect && <ConnectTab active={activeTab === 'connect'} />}
      </div>
      <div className={`tab${activeTab === 'you' ? ' active' : ''}`} id="tab-you">
        {mounted.you && <YouTab active={activeTab === 'you'} />}
      </div>
    </div>
  );
}
