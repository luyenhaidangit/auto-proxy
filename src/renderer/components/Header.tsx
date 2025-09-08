import React from 'react';
import { AppInfo } from '../../preload/api-schema';

interface HeaderProps {
  appInfo: AppInfo | null;
  theme: 'light' | 'dark' | 'system';
  onThemeToggle: () => void;
  activeTab: 'proxy' | 'files' | 'settings';
  onTabChange: (tab: 'proxy' | 'files' | 'settings') => void;
}

const Header: React.FC<HeaderProps> = ({
  appInfo,
  theme,
  onThemeToggle,
  activeTab,
  onTabChange
}) => {
  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return '☀️';
      case 'dark': return '🌙';
      case 'system': return '💻';
      default: return '💻';
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light': return 'Light';
      case 'dark': return 'Dark';
      case 'system': return 'System';
      default: return 'System';
    }
  };

  return (
    <header style={{
      background: 'var(--bg-primary)',
      borderBottom: '1px solid var(--border-color)',
      padding: '12px 16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      minHeight: '60px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div>
          <h1 style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: '600',
            color: 'var(--text-primary)'
          }}>
            Auto Proxy
          </h1>
          {appInfo && (
            <div style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              marginTop: '2px'
            }}>
              v{appInfo.version} • {appInfo.platform} • {appInfo.arch}
            </div>
          )}
        </div>
        
        <nav style={{ display: 'flex', gap: '8px' }}>
          {[
            { id: 'proxy' as const, label: 'Proxy Settings', icon: '🔧' },
            { id: 'files' as const, label: 'File Manager', icon: '📁' },
            { id: 'settings' as const, label: 'Settings', icon: '⚙️' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-outline'}`}
              style={{
                fontSize: '14px',
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onThemeToggle}
          className="btn btn-outline"
          style={{
            fontSize: '14px',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          title={`Current theme: ${getThemeLabel()}`}
        >
          <span>{getThemeIcon()}</span>
          {getThemeLabel()}
        </button>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => window.api.minimizeWindow()}
            className="btn btn-outline"
            style={{ padding: '8px 12px', fontSize: '14px' }}
            title="Minimize"
          >
            ➖
          </button>
          <button
            onClick={() => window.api.maximizeWindow()}
            className="btn btn-outline"
            style={{ padding: '8px 12px', fontSize: '14px' }}
            title="Maximize"
          >
            ⬜
          </button>
          <button
            onClick={() => window.api.closeWindow()}
            className="btn btn-outline"
            style={{ padding: '8px 12px', fontSize: '14px' }}
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
