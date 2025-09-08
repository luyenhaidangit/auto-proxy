import React from 'react';
import { Settings } from '../../preload/api-schema';

interface SettingsPanelProps {
  settings: Settings | null;
  onSettingsChange: (settings: Partial<Settings>) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSettingsChange }) => {
  if (!settings) {
    return (
      <div className="card">
        <div className="text-center">
          <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
          <div>Loading settings...</div>
        </div>
      </div>
    );
  }

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    onSettingsChange({ theme });
  };

  const handleLanguageChange = (language: string) => {
    onSettingsChange({ language });
  };

  const handleAutoStartChange = (autoStart: boolean) => {
    onSettingsChange({ autoStart });
  };

  const handleResetSettings = async () => {
    try {
      await window.api.showMessageBox({
        type: 'question',
        title: 'Reset Settings',
        message: 'Are you sure you want to reset all settings to defaults?',
        buttons: ['Cancel', 'Reset']
      });
      
      // Note: The actual reset is handled by the IPC handler
      // This is just for UI feedback
    } catch (error) {
      console.error('Failed to reset settings:', error);
    }
  };

  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <div className="card">
        <h2 style={{ margin: '0 0 24px 0', color: 'var(--text-primary)' }}>
          Application Settings
        </h2>

        <div className="form-group">
          <label className="form-label">Theme</label>
          <div style={{ display: 'flex', gap: '12px' }}>
            {[
              { value: 'light', label: 'Light', icon: '☀️' },
              { value: 'dark', label: 'Dark', icon: '🌙' },
              { value: 'system', label: 'System', icon: '💻' }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => handleThemeChange(option.value as 'light' | 'dark' | 'system')}
                className={`btn ${settings.theme === option.value ? 'btn-primary' : 'btn-outline'}`}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span>{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="language">Language</label>
          <select
            id="language"
            className="form-select"
            value={settings.language}
            onChange={(e) => handleLanguageChange(e.target.value)}
          >
            <option value="en">English</option>
            <option value="vi">Tiếng Việt</option>
            <option value="zh">中文</option>
            <option value="ja">日本語</option>
            <option value="ko">한국어</option>
          </select>
        </div>

        <div className="form-group">
          <div className="form-checkbox">
            <input
              type="checkbox"
              id="autoStart"
              checked={settings.autoStart}
              onChange={(e) => handleAutoStartChange(e.target.checked)}
            />
            <label htmlFor="autoStart">Start automatically when system boots</label>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Window Bounds</label>
          <div style={{
            background: 'var(--bg-secondary)',
            padding: '12px',
            borderRadius: 'var(--border-radius)',
            fontSize: '14px',
            color: 'var(--text-secondary)'
          }}>
            <div>Width: {settings.windowBounds.width}px</div>
            <div>Height: {settings.windowBounds.height}px</div>
            {settings.windowBounds.x !== undefined && (
              <div>X Position: {settings.windowBounds.x}px</div>
            )}
            {settings.windowBounds.y !== undefined && (
              <div>Y Position: {settings.windowBounds.y}px</div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Recent Files</label>
          <div style={{
            background: 'var(--bg-secondary)',
            padding: '12px',
            borderRadius: 'var(--border-radius)',
            maxHeight: '200px',
            overflow: 'auto'
          }}>
            {settings.recentFiles.length > 0 ? (
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {settings.recentFiles.map((file, index) => (
                  <li key={index} style={{ marginBottom: '4px', fontSize: '14px' }}>
                    <code style={{ color: 'var(--text-secondary)' }}>{file}</code>
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                No recent files
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button
            onClick={handleResetSettings}
            className="btn btn-outline"
            style={{ color: 'var(--danger-color)', borderColor: 'var(--danger-color)' }}
          >
            Reset to Defaults
          </button>
        </div>
      </div>

      <div className="card">
        <h3 style={{ margin: '0 0 16px 0', color: 'var(--text-primary)' }}>
          About Auto Proxy
        </h3>
        <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          <p>
            Auto Proxy is a modern Electron application built with TypeScript, React, and Vite.
            It demonstrates best practices for secure Main-Preload-Renderer architecture.
          </p>
          <p>
            <strong>Features:</strong>
          </p>
          <ul style={{ marginLeft: '20px' }}>
            <li>Secure IPC communication with contextBridge</li>
            <li>File management and editing capabilities</li>
            <li>Proxy configuration and testing</li>
            <li>Theme switching (Light/Dark/System)</li>
            <li>Settings persistence</li>
            <li>Modern UI with responsive design</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
