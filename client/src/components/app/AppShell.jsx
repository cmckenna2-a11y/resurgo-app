import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import HomeTab from './HomeTab';
import ToolsTab from './ToolsTab';
import JournalTab from './JournalTab';
import ConnectTab from './ConnectTab';
import YouTab from './YouTab';

function getInitials(name = '') {
  return name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function AppShell() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  const firstName = profile?.name?.split(' ')[0] || '';
  const initials = getInitials(profile?.name);

  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'tools', label: 'Tools' },
    { id: 'journal', label: 'Journal' },
    { id: 'connect', label: 'Connect' },
    { id: 'you', label: 'You' },
  ];

  return (
    <div className="phone">
      <div className="header">
        <div>
          <div className="header-title">Resurgo</div>
          <div className="header-sub">Hello, {firstName} 👋</div>
        </div>
        <div className="avatar" onClick={() => setActiveTab('you')} title="Profile">{initials}</div>
      </div>

      <div className="nav">
        {tabs.map(t => (
          <button key={t.id} className={`nav-btn${activeTab === t.id ? ' active' : ''}`} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className={`tab${activeTab === 'home' ? ' active' : ''}`} id="tab-home">
        <HomeTab active={activeTab === 'home'} onNavigate={setActiveTab} />
      </div>
      <div className={`tab${activeTab === 'tools' ? ' active' : ''}`} id="tab-tools">
        <ToolsTab active={activeTab === 'tools'} />
      </div>
      <div className={`tab${activeTab === 'journal' ? ' active' : ''}`} id="tab-journal">
        <JournalTab active={activeTab === 'journal'} />
      </div>
      <div className={`tab${activeTab === 'connect' ? ' active' : ''}`} id="tab-connect">
        <ConnectTab active={activeTab === 'connect'} />
      </div>
      <div className={`tab${activeTab === 'you' ? ' active' : ''}`} id="tab-you">
        <YouTab active={activeTab === 'you'} />
      </div>
    </div>
  );
}
