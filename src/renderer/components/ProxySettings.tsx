import React, { useState } from 'react';
import { ProxyConfig } from '../../preload/api-schema';

interface ProxySettingsProps {
  config: ProxyConfig | null;
  onConfigChange: (config: ProxyConfig) => void;
}

const ProxySettings: React.FC<ProxySettingsProps> = ({ config, onConfigChange }) => {
  const [formData, setFormData] = useState<ProxyConfig>(
    config || {
      enabled: false,
      host: '127.0.0.1',
      port: 8080,
      type: 'http'
    }
  );
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<boolean | null>(null);

  const handleInputChange = (field: keyof ProxyConfig, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      await onConfigChange(formData);
      await window.api.showMessageBox({
        type: 'info',
        title: 'Success',
        message: 'Proxy configuration saved successfully'
      });
    } catch (error) {
      console.error('Failed to save proxy config:', error);
    }
  };

  const handleTest = async () => {
    try {
      setTesting(true);
      setTestResult(null);
      
      const result = await window.api.testProxyConnection(formData);
      setTestResult(result);
      
      await window.api.showMessageBox({
        type: result ? 'info' : 'warning',
        title: 'Connection Test',
        message: result ? 'Proxy connection successful!' : 'Proxy connection failed'
      });
    } catch (error) {
      console.error('Failed to test proxy:', error);
      setTestResult(false);
    } finally {
      setTesting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      enabled: false,
      host: '127.0.0.1',
      port: 8080,
      type: 'http'
    });
    setTestResult(null);
  };

  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <div className="card">
        <h2 style={{ margin: '0 0 24px 0', color: 'var(--text-primary)' }}>
          Proxy Configuration
        </h2>
        
        <div className="form-group">
          <div className="form-checkbox">
            <input
              type="checkbox"
              id="enabled"
              checked={formData.enabled}
              onChange={(e) => handleInputChange('enabled', e.target.checked)}
            />
            <label htmlFor="enabled">Enable Proxy</label>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="type">Proxy Type</label>
            <select
              id="type"
              className="form-select"
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              disabled={!formData.enabled}
            >
              <option value="http">HTTP</option>
              <option value="https">HTTPS</option>
              <option value="socks4">SOCKS4</option>
              <option value="socks5">SOCKS5</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="host">Host</label>
            <input
              id="host"
              type="text"
              className="form-input"
              value={formData.host}
              onChange={(e) => handleInputChange('host', e.target.value)}
              disabled={!formData.enabled}
              placeholder="127.0.0.1"
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="port">Port</label>
            <input
              id="port"
              type="number"
              className="form-input"
              value={formData.port}
              onChange={(e) => handleInputChange('port', parseInt(e.target.value) || 8080)}
              disabled={!formData.enabled}
              min="1"
              max="65535"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="username">Username (Optional)</label>
            <input
              id="username"
              type="text"
              className="form-input"
              value={formData.username || ''}
              onChange={(e) => handleInputChange('username', e.target.value || undefined)}
              disabled={!formData.enabled}
              placeholder="Leave empty if not required"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">Password (Optional)</label>
          <input
            id="password"
            type="password"
            className="form-input"
            value={formData.password || ''}
            onChange={(e) => handleInputChange('password', e.target.value || undefined)}
            disabled={!formData.enabled}
            placeholder="Leave empty if not required"
          />
        </div>

        {testResult !== null && (
          <div className="form-group">
            <div className={`status-indicator ${testResult ? 'status-success' : 'status-danger'}`}>
              <span>{testResult ? '✅' : '❌'}</span>
              <span>{testResult ? 'Connection successful' : 'Connection failed'}</span>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button
            onClick={handleSave}
            className="btn btn-primary"
            disabled={!formData.enabled}
          >
            Save Configuration
          </button>
          
          <button
            onClick={handleTest}
            className="btn btn-secondary"
            disabled={!formData.enabled || testing}
          >
            {testing ? (
              <>
                <span className="spinner" style={{ marginRight: '8px' }}></span>
                Testing...
              </>
            ) : (
              'Test Connection'
            )}
          </button>
          
          <button
            onClick={handleReset}
            className="btn btn-outline"
          >
            Reset to Defaults
          </button>
        </div>
      </div>

      <div className="card">
        <h3 style={{ margin: '0 0 16px 0', color: 'var(--text-primary)' }}>
          Current Configuration
        </h3>
        <div style={{
          background: 'var(--bg-secondary)',
          padding: '16px',
          borderRadius: 'var(--border-radius)',
          fontFamily: 'monospace',
          fontSize: '14px',
          color: 'var(--text-secondary)'
        }}>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

export default ProxySettings;
